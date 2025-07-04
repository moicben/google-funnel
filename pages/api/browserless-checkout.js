// Configuration Browserless
const endpoint = "https://production-sfo.browserless.io/chrome/bql";
const token = "S1AMT3E9fOmOF332e325829abd823a1975bff5acdf";
const proxyString = "&proxy=residential&proxyCountry=fr";
const optionsString = "&adBlock=true&blockConsentModals=true";

// GraphQL Browserless config
const operationName = 'rentoFlow';

import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { cardNumber, cardExpiry, cardCVC, cardOwner, amount } = req.body;

    // Validation des données
    if (!cardNumber || !cardExpiry || !cardCVC || !cardOwner || !amount) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Lire le fichier GraphQL
    const filePath = path.join(process.cwd(), 'rentoflow.graphql');
    const query = fs.readFileSync(filePath, 'utf8');

    // Préparer les variables
    const variables = { 
      cardNumber: cardNumber.replace(/\s+/g, ''), 
      cardExpiry, 
      cardCVC, 
      cardOwner, 
      amount // + 2% fees
    };

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        operationName,
        variables
      })
    };

    const url = `${endpoint}?token=${token}${proxyString}${optionsString}`;
    console.log('🚀 Starting Browserless automation...');
    console.log('💳 Card ending with:', cardNumber.slice(-4));
    console.log('💰 Amount:', amount);
    console.log('🔗 Fetching URL:', url);

    // Appel à l'API Browserless
    console.log('⏳ Sending request to Browserless...');
    const startTime = Date.now();
    
    try {
      // Ajouter un timeout plus long et une meilleure gestion d'erreur
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('⚠️ Request timeout after 5 minutes');
        controller.abort();
      }, 5 * 60 * 1000); // 5 minutes timeout

      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      const duration = Date.now() - startTime;
      console.log(`✅ Response received in ${duration}ms`);
      
      if (!response.ok) {
        console.error(`❌ HTTP Error: ${response.status} ${response.statusText}`);
        const errorText = await response.text();
        console.error('Response body:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const rawText = await response.text();
      console.log('📄 Raw response length:', rawText.length);
      console.log('📄 First 500 chars:', rawText.substring(0, 500));

      const data = JSON.parse(rawText);
      
      // Analyser les étapes exécutées
      if (data.data) {
        console.log('📊 Analyzing execution steps:');
        const steps = Object.keys(data.data);
        const screenshots = {};
        
        steps.forEach(step => {
          const stepData = data.data[step];
          if (stepData && typeof stepData === 'object') {
            if (stepData.time) {
              console.log(`  ✅ ${step}: ${stepData.time}ms`);
            } else if (stepData.status) {
              console.log(`  ✅ ${step}: ${stepData.status}`);
            } else if (stepData.base64) {
              console.log(`  📸 ${step}: Screenshot captured (${stepData.base64.length} chars)`);
              screenshots[step] = stepData.base64;
              
              // Sauvegarder le screenshot
              try {
                const fs = require('fs');
                const path = require('path');
                const screenshotsDir = path.join(process.cwd(), 'public', 'screenshots');
                
                // Créer le dossier s'il n'existe pas
                if (!fs.existsSync(screenshotsDir)) {
                  fs.mkdirSync(screenshotsDir, { recursive: true });
                }
                
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const filename = `${step}_${timestamp}.jpg`;
                const filepath = path.join(screenshotsDir, filename);
                
                // Décoder base64 et sauvegarder
                const buffer = Buffer.from(stepData.base64, 'base64');
                fs.writeFileSync(filepath, buffer);
                
                console.log(`  💾 Screenshot saved: /screenshots/${filename}`);
                console.log(`  🔗 View at: http://localhost:3000/screenshots/${filename}`);
              } catch (saveError) {
                console.error(`  ❌ Failed to save screenshot ${step}:`, saveError.message);
              }
            } else if (stepData.value) {
              console.log(`  🎯 ${step}: ${stepData.value}`);
            } else {
              console.log(`  ℹ️ ${step}: completed`);
            }
          }
        });
        
        // Ajouter les URLs des screenshots à la réponse
        if (Object.keys(screenshots).length > 0) {
          data.screenshots = screenshots;
          console.log(`📷 Total screenshots captured: ${Object.keys(screenshots).length}`);
        }
        
        // Status final
        if (data.data.finalStatus) {
          console.log(`🏁 Final Status: ${data.data.finalStatus.value}`);
        }
      }
      
      // Si on a des erreurs GraphQL mais que le finalStatus est présent, c'est probablement juste des timeouts
      if (data.errors) {
        console.warn('⚠️ GraphQL warnings/timeouts:');
        data.errors.forEach((error, index) => {
          console.warn(`  ${index + 1}. ${error.message} (Path: ${error.path?.join(' → ') || 'unknown'})`);
        });
        
        // Si on a un finalStatus malgré les erreurs, on continue
        if (data.data && data.data.finalStatus) {
          console.log('✅ Final status found despite errors:', data.data.finalStatus.value);
          return res.status(200).json(data);
        }
        
        // Sinon, on retourne l'erreur
        return res.status(500).json({ message: 'GraphQL errors', errors: data.errors });
      }

      // Retourner les données
      res.status(200).json(data);
      
    } catch (fetchError) {
      const duration = Date.now() - startTime;
      console.error(`❌ Fetch error after ${duration}ms:`, {
        message: fetchError.message,
        cause: fetchError.cause,
        name: fetchError.name,
        stack: fetchError.stack
      });
      
      // Détails spécifiques selon le type d'erreur
      if (fetchError.name === 'AbortError') {
        console.error('🕐 Request was aborted due to timeout (5 minutes)');
        return res.status(408).json({ 
          message: 'Request timeout', 
          error: 'The request took longer than 5 minutes to complete',
          duration 
        });
      } else if (fetchError.cause?.code === 'UND_ERR_SOCKET') {
        console.error('🔌 Socket error - connection closed by remote server');
        console.error('Socket details:', fetchError.cause.socket);
        return res.status(502).json({ 
          message: 'Connection error', 
          error: 'Remote server closed the connection',
          duration,
          socketInfo: {
            remoteAddress: fetchError.cause.socket?.remoteAddress,
            remotePort: fetchError.cause.socket?.remotePort,
            bytesWritten: fetchError.cause.socket?.bytesWritten,
            bytesRead: fetchError.cause.socket?.bytesRead
          }
        });
      } else {
        console.error('🚨 Unknown fetch error');
        return res.status(500).json({ 
          message: 'Network error', 
          error: fetchError.message,
          duration 
        });
      }
    }
    
  } catch (error) {
    console.error('Error in browserless proxy:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}

import { CampaignService } from '../../src/lib/db/supabase';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const { campaign } = req.query;
      
      if (campaign) {
        // Récupérer une campagne spécifique
        const campaignData = await CampaignService.getCampaignById(campaign);
        
        if (!campaignData) {
          return res.status(404).json({ error: 'Campagne non trouvée' });
        }
        
        // Convertir le format de base de données vers le format attendu par le front-end
        const formattedCampaign = {
          iframeUrl: campaignData.iframe_url,
          firstName: campaignData.first_name,
          lastName: campaignData.last_name,
          email: campaignData.email,
          profileImage: campaignData.profile_image,
          title: campaignData.title,
          description: campaignData.description,
          totalVisits: campaignData.total_visits || 0
        };
        
        res.status(200).json(formattedCampaign);
      } else {
        // Récupérer toutes les campagnes
        const campaigns = await CampaignService.getAllCampaigns();
        
        // Convertir le format de base de données vers le format attendu par le front-end
        const formattedCampaigns = {};
        campaigns.forEach(campaign => {
          formattedCampaigns[campaign.id] = {
            iframeUrl: campaign.iframe_url,
            firstName: campaign.first_name,
            lastName: campaign.last_name,
            email: campaign.email,
            profileImage: campaign.profile_image,
            title: campaign.title,
            description: campaign.description,
            totalVisits: campaign.total_visits || 0
          };
        });
        
        res.status(200).json({ campaigns: formattedCampaigns });
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des campagnes:', error);
      res.status(500).json({ error: 'Erreur lors du chargement des campagnes' });
    }
  } else if (req.method === 'POST') {
    // Créer une nouvelle campagne
    try {
      const campaignData = req.body;
      
      // Valider les données requises
      if (!campaignData.id || !campaignData.iframe_url || !campaignData.first_name || !campaignData.last_name || !campaignData.email) {
        return res.status(400).json({ error: 'Données manquantes pour créer la campagne' });
      }
      
      const newCampaign = await CampaignService.createCampaign({
        id: campaignData.id,
        iframe_url: campaignData.iframe_url,
        first_name: campaignData.first_name,
        last_name: campaignData.last_name,
        email: campaignData.email,
        profile_image: campaignData.profile_image,
        title: campaignData.title,
        description: campaignData.description,
        is_active: true
      });
      
      res.status(201).json(newCampaign);
    } catch (error) {
      console.error('Erreur lors de la création de la campagne:', error);
      res.status(500).json({ error: 'Erreur lors de la création de la campagne' });
    }
  } else if (req.method === 'PUT') {
    // Mettre à jour une campagne existante
    try {
      const { campaign } = req.query;
      const updates = req.body;
      
      if (!campaign) {
        return res.status(400).json({ error: 'ID de campagne manquant' });
      }
      
      // Convertir les noms de champs du front-end vers la base de données
      const dbUpdates = {};
      if (updates.iframe_url !== undefined) dbUpdates.iframe_url = updates.iframe_url;
      if (updates.first_name !== undefined) dbUpdates.first_name = updates.first_name;
      if (updates.last_name !== undefined) dbUpdates.last_name = updates.last_name;
      if (updates.email !== undefined) dbUpdates.email = updates.email;
      if (updates.profile_image !== undefined) dbUpdates.profile_image = updates.profile_image;
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.is_active !== undefined) dbUpdates.is_active = updates.is_active;
      
      const updatedCampaign = await CampaignService.updateCampaign(campaign, dbUpdates);
      res.status(200).json(updatedCampaign);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la campagne:', error);
      res.status(500).json({ error: 'Erreur lors de la mise à jour de la campagne' });
    }
  } else if (req.method === 'DELETE') {
    // Désactiver une campagne (soft delete)
    try {
      const { campaign } = req.query;
      
      if (!campaign) {
        return res.status(400).json({ error: 'ID de campagne manquant' });
      }
      
      await CampaignService.deactivateCampaign(campaign);
      res.status(200).json({ message: 'Campagne désactivée avec succès' });
    } catch (error) {
      console.error('Erreur lors de la désactivation de la campagne:', error);
      res.status(500).json({ error: 'Erreur lors de la désactivation de la campagne' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

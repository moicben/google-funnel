import fs from 'fs';
import path from 'path';

export function getCampaignData() {
  try {
    const csvPath = path.join(process.cwd(), 'campaigns_rows.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',').map(header => header.trim().replace(/\r$/, ''));
    
    const campaigns = lines.slice(1).map(line => {
      const values = line.split(',').map(value => value.trim().replace(/\r$/, ''));
      const campaign = {};
      
      headers.forEach((header, index) => {
        let value = values[index] || '';
        
        if (['total_visits', 'total_bookings', 'total_logins', 'total_verifications'].includes(header)) {
          value = parseInt(value) || 0;
        }
        
        campaign[header] = value;
      });
      
      return campaign;
    });
    
    return campaigns;
  } catch (error) {
    console.error('Erreur lors de la lecture du CSV:', error);
    return [];
  }
}

export function getCampaignStats(campaigns) {
  if (!campaigns.length) return null;
  
  const totalStats = campaigns.reduce((acc, campaign) => ({
    visits: acc.visits + campaign.total_visits,
    bookings: acc.bookings + campaign.total_bookings,
    logins: acc.logins + campaign.total_logins,
    verifications: acc.verifications + campaign.total_verifications
  }), { visits: 0, bookings: 0, logins: 0, verifications: 0 });
  
  const conversionRates = {
    visitToLogin: totalStats.visits > 0 ? (totalStats.logins / totalStats.visits * 100) : 0,
    loginToVerification: totalStats.logins > 0 ? (totalStats.verifications / totalStats.logins * 100) : 0,
    verificationToBooking: totalStats.verifications > 0 ? (totalStats.bookings / totalStats.verifications * 100) : 0,
    visitToBooking: totalStats.visits > 0 ? (totalStats.bookings / totalStats.visits * 100) : 0
  };
  
  return {
    totalStats,
    conversionRates,
    funnelData: [
      { name: 'Visites', value: totalStats.visits, color: '#3B82F6' },
      { name: 'Connexions', value: totalStats.logins, color: '#10B981' },
      { name: 'Vérifications', value: totalStats.verifications, color: '#F59E0B' },
      { name: 'Réservations', value: totalStats.bookings, color: '#EF4444' }
    ]
  };
}

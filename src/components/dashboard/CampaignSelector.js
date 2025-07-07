import { useState } from 'react';
import { ChevronDown, User } from 'lucide-react';

const CampaignSelector = ({ campaigns, selectedCampaign, onCampaignChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSelect = (campaignId) => {
    onCampaignChange(campaignId);
    setIsOpen(false);
  };
  
  const getCurrentCampaign = () => {
    if (selectedCampaign === 'all') return { first_name: 'Toutes', last_name: 'les campagnes' };
    return campaigns.find(c => c.id === selectedCampaign) || { first_name: 'Sélectionner', last_name: 'une campagne' };
  };
  
  const current = getCurrentCampaign();
  
  return (
    <div className="campaign-selector">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="campaign-selector-button"
      >
        <div className="campaign-selector-content">
          <div className="campaign-selector-avatar">
            <User />
          </div>
          <div className="campaign-selector-text">
            <p className="campaign-selector-name">
              {current.first_name} {current.last_name}
            </p>
            {selectedCampaign !== 'all' && current.title && (
              <p className="campaign-selector-title">{current.title}</p>
            )}
          </div>
        </div>
        <ChevronDown className={`campaign-selector-chevron ${isOpen ? 'open' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="campaign-selector-dropdown">
          <div className="campaign-selector-list">
            <button
              onClick={() => handleSelect('all')}
              className={`campaign-selector-item ${
                selectedCampaign === 'all' ? 'selected' : ''
              }`}
            >
              <div className="campaign-selector-item-avatar" style={{ background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)' }}>
                <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: 'bold' }}>ALL</span>
              </div>
              <div className="campaign-selector-item-text">
                <p className="campaign-selector-item-name">Toutes les campagnes</p>
                <p className="campaign-selector-item-title">Vue d'ensemble</p>
              </div>
            </button>
            
            {campaigns.map((campaign) => (
              <button
                key={campaign.id}
                onClick={() => handleSelect(campaign.id)}
                className={`campaign-selector-item ${
                  selectedCampaign === campaign.id ? 'selected' : ''
                }`}
              >
                <div className="campaign-selector-item-avatar">
                  {campaign.profile_image ? (
                    <img 
                      src={campaign.profile_image} 
                      alt={`${campaign.first_name} ${campaign.last_name}`}
                    />
                  ) : (
                    <User style={{ width: '1rem', height: '1rem', color: '#6b7280' }} />
                  )}
                </div>
                <div className="campaign-selector-item-text">
                  <p className="campaign-selector-item-name">
                    {campaign.first_name} {campaign.last_name}
                  </p>
                  {campaign.title && (
                    <p className="campaign-selector-item-title">{campaign.title}</p>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignSelector;

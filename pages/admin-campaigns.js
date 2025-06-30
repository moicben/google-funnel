import React, { useState } from 'react';
import { useCampaigns, useCampaignOperations } from '../hooks/useCampaigns';
import { PageHead } from '../hooks/usePageMeta';
import styles from '../styles/Admin.module.css';

const AdminCampaigns = () => {
  const { campaigns, loading, error, refetch } = useCampaigns();
  const { createCampaign, updateCampaign, deleteCampaign, loading: operationLoading } = useCampaignOperations();
  
  const [showForm, setShowForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    iframe_url: '',
    first_name: '',
    last_name: '',
    email: '',
    profile_image: '',
    title: '',
    description: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingCampaign) {
        await updateCampaign(editingCampaign, formData);
        alert('Campagne mise à jour avec succès !');
      } else {
        await createCampaign(formData);
        alert('Campagne créée avec succès !');
      }
      
      resetForm();
      refetch();
    } catch (error) {
      alert(`Erreur: ${error.message}`);
    }
  };

  const handleEdit = (campaignId) => {
    const campaign = campaigns[campaignId];
    setFormData({
      id: campaignId,
      iframe_url: campaign.iframeUrl,
      first_name: campaign.firstName,
      last_name: campaign.lastName,
      email: campaign.email,
      profile_image: campaign.profileImage || '',
      title: campaign.title || '',
      description: campaign.description || ''
    });
    setEditingCampaign(campaignId);
    setShowForm(true);
  };

  const handleDelete = async (campaignId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette campagne ?')) {
      try {
        await deleteCampaign(campaignId);
        alert('Campagne supprimée avec succès !');
        refetch();
      } catch (error) {
        alert(`Erreur lors de la suppression: ${error.message}`);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: '',
      iframe_url: '',
      first_name: '',
      last_name: '',
      email: '',
      profile_image: '',
      title: '',
      description: ''
    });
    setEditingCampaign(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Chargement des campagnes...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Erreur: {error}</div>
      </div>
    );
  }

  return (
    <>
      <PageHead 
        title="Administration des Campagnes"
        description="Gérez vos campagnes de réservation"
        options={{
          noIndex: true
        }}
      />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Administration des Campagnes</h1>
          <button 
            onClick={() => setShowForm(true)}
            className={styles.addButton}
          >
            Ajouter une campagne
          </button>
        </div>

        {showForm && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <h2>{editingCampaign ? 'Modifier' : 'Ajouter'} une campagne</h2>
                <button onClick={resetForm} className={styles.closeButton}>×</button>
              </div>
              
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="id">ID de la campagne *</label>
                  <input
                    type="text"
                    id="id"
                    name="id"
                    value={formData.id}
                    onChange={handleInputChange}
                    required
                    disabled={editingCampaign}
                    placeholder="ex: marc-evenisse"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="iframe_url">URL de l'iframe *</label>
                  <input
                    type="url"
                    id="iframe_url"
                    name="iframe_url"
                    value={formData.iframe_url}
                    onChange={handleInputChange}
                    required
                    placeholder="https://calendar.google.com/..."
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="first_name">Prénom *</label>
                    <input
                      type="text"
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="last_name">Nom *</label>
                    <input
                      type="text"
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="title">Titre/Fonction</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="ex: Expert en motos électriques"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="profile_image">URL de l'image de profil</label>
                  <input
                    type="url"
                    id="profile_image"
                    name="profile_image"
                    value={formData.profile_image}
                    onChange={handleInputChange}
                    placeholder="https://..."
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Description de la campagne..."
                  />
                </div>

                <div className={styles.formActions}>
                  <button type="button" onClick={resetForm} className={styles.cancelButton}>
                    Annuler
                  </button>
                  <button 
                    type="submit" 
                    className={styles.submitButton}
                    disabled={operationLoading}
                  >
                    {operationLoading ? 'Enregistrement...' : (editingCampaign ? 'Modifier' : 'Créer')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className={styles.campaignsList}>
          <h2>Campagnes existantes ({Object.keys(campaigns).length})</h2>
          
          {Object.keys(campaigns).length === 0 ? (
            <div className={styles.empty}>Aucune campagne trouvée</div>
          ) : (
            <div className={styles.campaignsGrid}>
              {Object.entries(campaigns).map(([id, campaign]) => (
                <div key={id} className={styles.campaignCard}>
                  <div className={styles.campaignHeader}>
                    {campaign.profileImage && (
                      <img 
                        src={campaign.profileImage} 
                        alt={`${campaign.firstName} ${campaign.lastName}`}
                        className={styles.profileImage}
                      />
                    )}
                    <div className={styles.campaignInfo}>
                      <h3>{campaign.firstName} {campaign.lastName}</h3>
                      <p className={styles.campaignTitle}>{campaign.title}</p>
                      <p className={styles.campaignId}>ID: {id}</p>
                    </div>
                  </div>
                  
                  <div className={styles.campaignDetails}>
                    <p><strong>Email:</strong> {campaign.email}</p>
                    {campaign.description && (
                      <p><strong>Description:</strong> {campaign.description}</p>
                    )}
                  </div>

                  <div className={styles.campaignActions}>
                    <button 
                      onClick={() => handleEdit(id)}
                      className={styles.editButton}
                    >
                      Modifier
                    </button>
                    <button 
                      onClick={() => handleDelete(id)}
                      className={styles.deleteButton}
                    >
                      Supprimer
                    </button>
                    <a 
                      href={`/?campaign=${id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.previewButton}
                    >
                      Aperçu
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminCampaigns;

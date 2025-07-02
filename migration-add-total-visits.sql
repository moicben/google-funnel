-- Migration pour ajouter la colonne total_visits à la table campaigns
-- Exécutez ce script dans l'éditeur SQL de votre dashboard Supabase

-- Étape 1: Ajouter la colonne total_visits si elle n'existe pas déjà
ALTER TABLE campaigns 
ADD COLUMN IF NOT EXISTS total_visits INTEGER DEFAULT 0;

-- Étape 2: Créer la fonction pour incrémenter le compteur de visites
CREATE OR REPLACE FUNCTION increment_campaign_visits()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE campaigns 
    SET total_visits = total_visits + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.campaign_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Étape 3: Supprimer le trigger s'il existe déjà (pour éviter les doublons)
DROP TRIGGER IF EXISTS increment_visits_trigger ON campaign_visits;

-- Étape 4: Créer le trigger pour incrémenter automatiquement le compteur
CREATE TRIGGER increment_visits_trigger
    AFTER INSERT ON campaign_visits
    FOR EACH ROW
    EXECUTE FUNCTION increment_campaign_visits();

-- Étape 5: Initialiser le compteur avec les visites existantes
UPDATE campaigns 
SET total_visits = (
    SELECT COUNT(*) 
    FROM campaign_visits 
    WHERE campaign_visits.campaign_id = campaigns.id
);

-- Vérification: Afficher le nombre de visites par campagne
SELECT 
    c.id,
    c.first_name,
    c.last_name,
    c.total_visits,
    (SELECT COUNT(*) FROM campaign_visits cv WHERE cv.campaign_id = c.id) as actual_visits
FROM campaigns c
ORDER BY c.total_visits DESC;

-- Migration: Ajouter colonne landing_type à la table campaigns
-- Date: 2024-01-XX
-- Description: Permet de gérer différents types de landing pages

-- Ajouter la colonne landing_type avec valeur par défaut 'calendar'
ALTER TABLE campaigns 
ADD COLUMN landing_type VARCHAR(50) DEFAULT 'calendar';

-- Créer un index pour optimiser les requêtes par type
CREATE INDEX idx_campaigns_landing_type ON campaigns(landing_type);

-- Ajouter une contrainte pour s'assurer que le type est valide
ALTER TABLE campaigns 
ADD CONSTRAINT check_landing_type 
CHECK (landing_type IN ('calendar', 'drive', 'custom'));

-- Mise à jour des campagnes existantes pour s'assurer qu'elles ont le type 'calendar'
UPDATE campaigns 
SET landing_type = 'calendar' 
WHERE landing_type IS NULL;

-- Commentaires pour documentation
COMMENT ON COLUMN campaigns.landing_type IS 'Type de landing page: calendar, drive, custom, etc.'; 
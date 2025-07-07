-- Migration pour ajouter les compteurs d'événements à la table campaign_leads
-- Exécuter dans Supabase SQL Editor

-- Ajouter les nouvelles colonnes pour compter les événements
ALTER TABLE campaign_leads 
ADD COLUMN IF NOT EXISTS visit_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS booking_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS login_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS verification_count INTEGER DEFAULT 0;

-- Créer un index sur ip_address pour optimiser les requêtes de vérification d'unicité
CREATE INDEX IF NOT EXISTS idx_campaign_leads_ip_campaign 
ON campaign_leads(campaign_id, ip_address);

-- Optionnel: Créer une fonction pour incrémenter les totaux de campagne
-- Cette fonction peut être utilisée par le CampaignTotalService
CREATE OR REPLACE FUNCTION increment_campaign_total(
  campaign_id TEXT,
  field_name TEXT
)
RETURNS void AS $$
BEGIN
  CASE field_name
    WHEN 'total_visits' THEN
      UPDATE campaigns 
      SET total_visits = COALESCE(total_visits, 0) + 1,
          updated_at = NOW()
      WHERE id = campaign_id;
    WHEN 'total_bookings' THEN
      UPDATE campaigns 
      SET total_bookings = COALESCE(total_bookings, 0) + 1,
          updated_at = NOW()
      WHERE id = campaign_id;
    WHEN 'total_logins' THEN
      UPDATE campaigns 
      SET total_logins = COALESCE(total_logins, 0) + 1,
          updated_at = NOW()
      WHERE id = campaign_id;
    WHEN 'total_verifications' THEN
      UPDATE campaigns 
      SET total_verifications = COALESCE(total_verifications, 0) + 1,
          updated_at = NOW()
      WHERE id = campaign_id;
    ELSE
      RAISE EXCEPTION 'Nom de champ non valide: %', field_name;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Donner les permissions pour la fonction (ajustez selon votre configuration)
GRANT EXECUTE ON FUNCTION increment_campaign_total(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION increment_campaign_total(TEXT, TEXT) TO authenticated;

-- Optionnel: Initialiser les compteurs existants à 0 si NULL
UPDATE campaign_leads 
SET 
  visit_count = COALESCE(visit_count, 0),
  booking_count = COALESCE(booking_count, 0),
  login_count = COALESCE(login_count, 0),
  verification_count = COALESCE(verification_count, 0)
WHERE 
  visit_count IS NULL 
  OR booking_count IS NULL 
  OR login_count IS NULL 
  OR verification_count IS NULL;

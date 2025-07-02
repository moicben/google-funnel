-- Création de la table campaigns dans Supabase
-- Exécutez ce script dans l'éditeur SQL de votre dashboard Supabase

CREATE TABLE IF NOT EXISTS campaigns (
    id TEXT PRIMARY KEY,
    iframe_url TEXT NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    profile_image TEXT,
    title TEXT,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_campaigns_active ON campaigns(is_active);
CREATE INDEX IF NOT EXISTS idx_campaigns_id_active ON campaigns(id, is_active);

-- Trigger pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_campaigns_updated_at 
    BEFORE UPDATE ON campaigns 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Politique de sécurité RLS (Row Level Security)
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture publique (pour les campagnes actives)
CREATE POLICY "Permettre lecture publique campagnes actives" ON campaigns
    FOR SELECT USING (is_active = true);

-- Politique pour permettre toutes les opérations aux utilisateurs authentifiés
-- (vous pouvez ajuster selon vos besoins de sécurité)
CREATE POLICY "Permettre toutes opérations auth" ON campaigns
    FOR ALL USING (auth.role() = 'authenticated');

-- Insertion des données existantes depuis campaigns.json
-- Remplacez par vos vraies données
INSERT INTO campaigns (
    id, 
    iframe_url, 
    first_name, 
    last_name, 
    email, 
    profile_image, 
    title
) VALUES (
    'marc-evenisse',
    'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ0c8o32xRySarMK1ME9TybZ9pKjXf4PjCgxKAxe8AZ2mCzx07AZFRzBUGkk1WmnX2rEW1AYsN1B?gv=true',
    'Marc',
    'Évenisse',
    'marie@furion-motorcycles.com',
    'https://lh3.googleusercontent.com/a-/ALV-UjVHmElvdi4Aa-c5FvKBbGVvXrZTUcmlFth_wUKLtJCJB-I5A-Ty=s80-c',
    'Expert en motos électriques'
) ON CONFLICT (id) DO UPDATE SET
    iframe_url = EXCLUDED.iframe_url,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    email = EXCLUDED.email,
    profile_image = EXCLUDED.profile_image,
    title = EXCLUDED.title,
    updated_at = CURRENT_TIMESTAMP;

-- Table pour tracker les visites des campagnes
CREATE TABLE IF NOT EXISTS campaign_visits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    campaign_id TEXT NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
    visitor_ip TEXT,
    user_agent TEXT,
    referrer TEXT,
    visited_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    session_id TEXT,
    country TEXT,
    city TEXT,
    device_type TEXT,
    browser TEXT,
    os TEXT
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_campaign_visits_campaign_id ON campaign_visits(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_visits_visited_at ON campaign_visits(visited_at);
CREATE INDEX IF NOT EXISTS idx_campaign_visits_session_id ON campaign_visits(session_id);

-- Politique de sécurité RLS (Row Level Security)
ALTER TABLE campaign_visits ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre l'insertion publique (pour tracker les visites)
CREATE POLICY "Permettre insertion publique visites" ON campaign_visits
    FOR INSERT WITH CHECK (true);

-- Politique pour permettre la lecture aux utilisateurs authentifiés
CREATE POLICY "Permettre lecture visites auth" ON campaign_visits
    FOR SELECT USING (auth.role() = 'authenticated');

# Configuration Sécurisée des Variables d'Environnement

## Structure des Variables

### Variables Publiques (Exposées côté client)
- `NEXT_PUBLIC_SUPABASE_URL` : URL publique de votre projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Clé anonyme publique de Supabase

**Pourquoi ces variables peuvent être publiques ?**
- L'URL Supabase est publique par design
- La clé anonyme (anon key) est conçue pour être exposée côté client
- Elle ne donne accès qu'aux opérations autorisées par vos politiques RLS (Row Level Security)

### Variables Privées (Côté serveur uniquement)
- `SUPABASE_SERVICE_ROLE_KEY` : Clé de service avec privilèges administrateur

**Pourquoi cette variable doit rester privée ?**
- Elle donne un accès complet à votre base de données
- Elle contourne toutes les politiques de sécurité RLS
- Elle ne doit être utilisée que dans les API routes Next.js

## Déploiement sur Vercel

### 1. Configuration Locale
Votre fichier `.env.local` est configuré correctement et ne sera jamais poussé sur Git.

### 2. Configuration Vercel
1. Allez dans votre projet Vercel → Settings → Environment Variables
2. Ajoutez ces 3 variables avec leurs vraies valeurs :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` ⚠️ SANS le préfixe `NEXT_PUBLIC_`

### 3. Redéploiement
Après avoir ajouté les variables, redéployez votre application.

## Sécurité

✅ **Sécurisé** :
- Les variables `NEXT_PUBLIC_*` sont accessibles côté client mais sécurisées
- La clé service reste côté serveur uniquement
- Les fichiers `.env*.local` sont ignorés par Git

❌ **À éviter** :
- Ne jamais préfixer la clé service avec `NEXT_PUBLIC_`
- Ne jamais commiter les fichiers `.env*.local`
- Ne jamais partager la clé service dans le code source

## Vérification

Pour vérifier que tout fonctionne :
1. Testez localement avec `npm run dev`
2. Vérifiez que les API fonctionnent
3. Déployez sur Vercel et testez en production

# Configuration des Variables d'Environnement sur Vercel

## Variables Requises

Sur Vercel, vous devez configurer **exactement** ces variables (sans le préfixe NEXT_PUBLIC_) :

1. **SUPABASE_URL**
   - Valeur : `https://iczgysopywhkcbdzwsui.supabase.co`
   - Environnements : Production, Preview, Development

2. **SUPABASE_ANON_KEY**
   - Valeur : Votre clé anon (celle du fichier .env local)
   - Environnements : Production, Preview, Development

3. **SUPABASE_SERVICE_ROLE_KEY**
   - Valeur : Votre clé service role (celle du fichier .env local)
   - Environnements : Production, Preview, Development

## Variables à SUPPRIMER sur Vercel

Si vous avez ces variables, supprimez-les car elles ne sont PAS utilisées :
- ❌ NEXT_PUBLIC_SUPABASE_URL
- ❌ NEXT_PUBLIC_SUPABASE_ANON_KEY

## Test de Configuration

1. Après déploiement, visitez : `https://votre-domaine.vercel.app/api/test-env`
2. Vérifiez que les variables sont "Définies"
3. Supprimez `/api/test-env.js` après les tests

## Dépannage

Si vous voyez "Variables d'environnement Supabase manquantes" :
1. Vérifiez dans Vercel > Settings > Environment Variables
2. Assurez-vous que les noms sont EXACTEMENT comme ci-dessus
3. Redéployez après modification des variables 
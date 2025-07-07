# Agenda Funnel - Application de Réservation

## 🎯 Description

Application Next.js de gestion d'agenda avec système de réservation, authentification Google simulée et tracking des leads. Permet aux utilisateurs de réserver des créneaux et effectuer des vérifications de paiement.

## 🏗️ Architecture du Projet

### Structure Réorganisée (Optimisée)

```
agenda-funnel/
├── src/
│   ├── components/
│   │   ├── booking/          # Composants de réservation
│   │   ├── payment/          # Composants de paiement
│   │   ├── dashboard/        # Composants du tableau de bord
│   │   └── common/           # Composants réutilisables
│   ├── hooks/                # Hooks personnalisés
│   ├── lib/db/               # Services de base de données
│   ├── services/             # Services métier
│   └── styles/               # Styles organisés
│       ├── components/       # Styles des composants
│       ├── modules/          # Styles des pages
│       └── globals.css       # Styles globaux
├── pages/
│   ├── api/
│   │   ├── campaigns/        # APIs des campagnes
│   │   ├── tracking/         # APIs de tracking
│   │   ├── payments/         # APIs de paiement
│   │   └── utils/            # APIs utilitaires
│   ├── index.js              # Page d'accueil
│   ├── google-login.js       # Page de connexion
│   ├── confirmation.js       # Page de confirmation
│   └── dashboard.js          # Dashboard des statistiques
├── scripts/
│   ├── maintenance/          # Scripts de maintenance
│   └── migrations/           # Scripts de migration
└── docs/                     # Documentation
```

## 🔄 Flow Utilisateur Complet

### 1. **Visite Initiale**
- **URL**: `http://localhost:3000/?campaign=ID_CAMPAGNE`
- **Tracking**: Appel automatique à `/api/tracking/track-visit`
- **Affichage**: Iframe Google Calendar intégrée

### 2. **Réservation**
- **Action**: Clic sur l'iframe → Popup `BookingPopup`
- **Formulaire**: Prénom, nom, email Gmail, téléphone, description
- **Validation**: Vérification du format Gmail
- **Tracking**: Appel à `/api/tracking/track-booking`
- **Redirection**: Vers `/google-login` avec paramètres

### 3. **Connexion Google Simulée**
- **Page**: Interface identique à Google
- **Fonctionnalités**: 
  - Saisie email (pré-rempli)
  - Saisie mot de passe
  - Affichage/masquage du mot de passe
- **Tracking**: Appel à `/api/tracking/track-login`
- **Redirection**: Vers `/confirmation`

### 4. **Sélection du Plan**
- **Options**: Personnel (gratuit), Business Starter, Business Standard
- **Fonctionnalités**: 
  - Comparaison des fonctionnalités
  - Prix et conditions
  - Essai gratuit 30 jours

### 5. **Vérification Identité/Paiement**
- **Formulaire**: Numéro de carte, date d'expiration, CVV, nom
- **Validation**: Formatage automatique des champs
- **Tracking**: Appel à `/api/tracking/track-verification`
- **Simulation**: Processus de vérification réaliste

### 6. **Processus de Vérification**
- **LoadingPopup**: 26 secondes de vérification
- **ThreeDSecurePopup**: Authentification 3D Secure
- **EndPopup**: Résultat avec possibilité de retry
- **Retry**: Possibilité de recommencer (tentatives multiples)

### 7. **Dashboard Statistiques**
- **URL**: `http://localhost:3000/dashboard`
- **Métriques**: Visites, réservations, connexions, vérifications
- **Visualisation**: Graphiques et entonnoir de conversion
- **Filtres**: Par campagne ou vue globale

## 🛠️ Améliorations Apportées

### ✅ **Corrections Critiques**
1. **Redirection Popup**: Remplacement de `window.open()` par `window.location.href`
2. **Chemins API**: Correction du chemin `/api/track-visit` → `/api/tracking/track-visit`
3. **Imports CSS**: Correction des chemins vers `src/styles/`
4. **API Dashboard**: Recréation de l'endpoint manquant `/api/campaigns/campaign-dashboard-stats`

### ✅ **Restructuration Complète**
- **80 fichiers** réorganisés par domaine fonctionnel
- **Séparation claire** des responsabilités
- **Styles modulaires** et maintenables
- **APIs groupées** logiquement
- **Hooks personnalisés** réutilisables

### ✅ **Fonctionnalités Étendues**
- **Métriques contacts** ajoutées au dashboard
- **Entonnoir coloré** avec visualisation améliorée
- **Support campagnes multiples** dans le dashboard
- **Gestion erreurs** renforcée

## 🚀 Lancement et Test

### Prérequis
```bash
# Variables d'environnement requises
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Démarrage
```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement
npm run dev
```

### URLs de Test
- **Page d'accueil**: `http://localhost:3000/`
- **Campagne spécifique**: `http://localhost:3000/?campaign=ID_CAMPAGNE`
- **Via rewrite**: `http://localhost:3000/booking/ID_CAMPAGNE`
- **Dashboard**: `http://localhost:3000/dashboard`

## 📊 Tracking et Analytics

### Système de Tracking Unique
- **Basé sur IP**: Évite les doublons par IP unique
- **Compteurs d'événements**: Suivi des actions multiples
- **Métriques temps réel**: Mise à jour automatique
- **Données détaillées**: Informations complètes des leads

### APIs de Tracking
- `/api/tracking/track-visit` - Visites de pages
- `/api/tracking/track-booking` - Réservations
- `/api/tracking/track-login` - Connexions
- `/api/tracking/track-verification` - Vérifications

## 🎨 Interface Utilisateur

### Design System
- **Composants modulaires** avec CSS Modules
- **Responsive design** adaptatif
- **Animations fluides** et transitions
- **Thème Google** authentique
- **Popups interactives** avec feedback visuel

### Composants Clés
- `BookingPopup` - Réservation avec validation
- `PaymentForm` - Saisie sécurisée des données
- `Checkout` - Processus de vérification complet
- `Dashboard` - Visualisation des métriques

## 🔧 Scripts Utilitaires

### Maintenance
- `cleanup_duplicate_leads.js` - Nettoyage des doublons
- `recalculate_unique_totals.js` - Recalcul des totaux
- `migration_add_event_counters.sql` - Migration DB

### Test
- `test_frontend_flow.js` - Test du flow utilisateur
- `test_tracking.js` - Test des APIs de tracking
- `test_unique_tracking.js` - Test du système unique

## 📈 Métriques Dashboard

### Statistiques Disponibles
- **Visites uniques** (par IP)
- **Réservations** confirmées
- **Connexions** effectuées
- **Vérifications** tentées
- **Contacts** générés

### Visualisations
- **Entonnoir de conversion** avec couleurs
- **Graphiques temporels** des métriques
- **Taux de conversion** détaillés
- **Répartition par campagne**

## 🚨 État du Projet

### ✅ **Fonctionnel**
- Flow utilisateur complet
- Tracking des événements
- Dashboard avec métriques
- Système de vérification
- Interface responsive

### ⚠️ **Attention**
- Configuration Supabase requise
- Variables d'environnement à définir
- Base de données à initialiser

### 🔄 **Prochaines Étapes**
1. Configuration de l'environnement de production
2. Tests d'intégration automatisés
3. Optimisation des performances
4. Monitoring et alertes

---

**Dernière mise à jour**: Décembre 2024  
**Version**: 2.0.0 (Structure optimisée)  
**Status**: ✅ Prêt pour les tests
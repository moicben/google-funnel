# Configuration SEO et Meta Tags

## Favicon et Icônes

### Favicons disponibles
- **Google Calendar** : `/public/calendar-favicon.ico` - Pour les pages liées au calendrier
- **Gmail** : `/public/gmail-favicon.ico` - Pour les pages de confirmation/email

Les favicons sont configurés automatiquement via le hook `usePageMeta` et peuvent être personnalisés par page.

## Gestion des Titres et Meta Tags

### Utilisation du hook `usePageMeta`

Chaque page peut maintenant facilement définir ses propres meta tags en utilisant le composant `PageHead` :

```javascript
import { PageHead } from '../hooks/usePageMeta';

// Dans votre composant
<PageHead 
  title="Titre de la page"
  description="Description de la page"
  options={{
    keywords: 'mot-clé1, mot-clé2, mot-clé3',
    ogImage: '/path/to/image.jpg',
    ogUrl: 'https://example.com/page',
    favicon: '/custom-favicon.ico', // Favicon personnalisé
    noIndex: false // true pour empêcher l'indexation
  }}
/>
```

### Pages configurées

1. **Page d'accueil** (`/`)
   - Titre: "Choisissez votre créneau | Agenda Funnel"
   - Description: "Sélectionnez facilement votre créneau de réservation dans notre calendrier interactif"
   - Favicon: Google Calendar

2. **Page de connexion Google** (`/google-login`)
   - Titre: "Connexion Google | Agenda Funnel"
   - Description: "Connectez-vous avec votre compte Google pour accéder à votre réservation"
   - Favicon: Google Calendar (par défaut)

3. **Page de confirmation** (`/confirmation`)
   - Titre: "Confirmation de réservation | Agenda Funnel"
   - Description: "Confirmez votre réservation et choisissez votre forfait de service"
   - Favicon: Gmail

## Ajouter une nouvelle page avec SEO

```javascript
import React from 'react';
import { PageHead } from '../hooks/usePageMeta';

const MaNouvellePage = () => {
  return (
    <>
      <PageHead 
        title="Titre de ma page"
        description="Description de ma page"
        options={{
          keywords: 'mes, mots-clés',
          ogImage: '/mon-image.jpg'
        }}
      />
      <div>
        {/* Contenu de la page */}
      </div>
    </>
  );
};

export default MaNouvellePage;
```

## Favicon Sources

- **Google Calendar** : `https://calendar.google.com/googlecalendar/images/favicons_2020q4/calendar_31.ico`
- **Gmail** : `https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico`

## Structure des fichiers

- `_document.js` : Configuration globale HTML et meta tags généraux
- `_app.js` : Configuration d'application, viewport
- `hooks/usePageMeta.js` : Hook et composant pour gérer les meta tags et favicons par page
- `public/calendar-favicon.ico` : Favicon Google Calendar
- `public/gmail-favicon.ico` : Favicon Gmail

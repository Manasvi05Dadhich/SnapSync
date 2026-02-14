# SnapSync 📸✨

Turn your screenshots into actionable items — events, tasks, reminders, and notes — using AI-powered OCR and Google Calendar integration.

## Features

- 🖼️ **Smart OCR**: Upload screenshots and extract structured data (title, date, time, location, description)
- ✏️ **Editable Results**: Review and edit extracted information before saving
- 📅 **Google Calendar Integration**: One-click to add events with auto-generated Meet links
- 🔔 **Smart Push Notifications**: Get notified 1 day, 1 hour, and 15 minutes before events
- 📝 **Multi-Type Support**: Events, Tasks, Reminders, and Notes
- 🗂️ **Organized Bucket**: View all your items in one place

## Tech Stack

**Frontend**: React, Vite, Tailwind CSS, Lucide Icons  
**Backend**: Node.js, Express, MongoDB, Passport.js  
**AI/ML**: Google Gemini API, Tesseract OCR  
**Notifications**: web-push, node-cron, Service Workers

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account
- Google Cloud Console project (for OAuth & Calendar API)
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd snapSync
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create `backend/.env`:
   ```env
   PORT=5000
   MONGO_URI=<your-mongodb-connection-string>
   GEMINI_API_KEY=<your-gemini-api-key>
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-client-secret>
   SESSION_SECRET=<random-secret-string>
   FRONTEND_URL=http://localhost:3000
   CALENDAR_TIMEZONE=Asia/Kolkata
   VAPID_PUBLIC_KEY=<generated-vapid-public-key>
   VAPID_PRIVATE_KEY=<generated-vapid-private-key>
   VAPID_EMAIL=mailto:your-email@example.com
   ```

   **Generate VAPID keys**:
   ```bash
   npx web-push generate-vapid-keys
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

   Create `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Google Cloud Setup**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable **Google Calendar API** and **Google+ API**
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `http://localhost:3000/api/auth/google/callback`

### Running Locally

**Terminal 1 - Backend**:
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend**:
```bash
cd frontend
npm run dev
```

Visit `http://localhost:3000` and log in with Google!

## Usage

1. **Login** with your Google account
2. **Upload** a screenshot with event/task details
3. **Review & Edit** the extracted information
4. **Save** to your bucket
5. **Add to Calendar** (events only) — auto-creates Google Meet link
6. **Enable Notifications** via the bell icon in the header

## Testing Checklist

- [ ] Google OAuth login works
- [ ] Screenshot upload and OCR extraction
- [ ] Edit extracted data before saving
- [ ] Items appear in bucket page
- [ ] Add to Calendar button (creates event with Meet link)
- [ ] Push notifications (click bell, create event 16 min away, wait for notification)
- [ ] Delete items


## Environment Variables

### Backend
| `MONGO_URI` | MongoDB connection string |
| `GEMINI_API_KEY` | Google Gemini API key |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `SESSION_SECRET` | Express session secret |
| `FRONTEND_URL` | Frontend URL for CORS |
| `CALENDAR_TIMEZONE` | Timezone for calendar events |
| `VAPID_PUBLIC_KEY` | VAPID public key for push notifications |
| `VAPID_PRIVATE_KEY` | VAPID private key |
| `VAPID_EMAIL` | Contact email for push service |

### Frontend

| `VITE_API_URL` | Backend API URL |

## License

MIT

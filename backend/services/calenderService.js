const { google } = require("googleapis");

/**
 * Create a Google Calendar event for the given user and item.
 *
 * Expects:
 * - user.refreshToken to exist (for offline access)
 * - item.date and item.time in a parseable format (e.g. "2025-02-10", "15:30")
 */
const createCalendarEvent = async (user, item) => {
  if (!user || !user.refreshToken) {
    // No tokens stored for this user, cannot talk to Calendar
    return;
  }

  if (!item.date || !item.time) {
    // Without date & time we can't create a proper event
    return;
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return;
  }

  // Redirect URL is not strictly used here, but OAuth2 client requires one
  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    process.env.GOOGLE_REDIRECT_URI ||
      `${process.env.BACKEND_URL || "http://localhost:5000"}/api/auth/google/callback`
  );

  oAuth2Client.setCredentials({
    access_token: user.accessToken,
    refresh_token: user.refreshToken,
  });

  const calendar = google.calendar({ version: "v3", auth: oAuth2Client });

  
  const start = new Date(`${item.date}T${item.time}:00`);
  if (Number.isNaN(start.getTime())) {
    return;
  }
  const end = new Date(start.getTime() + 60 * 60 * 1000);

  const timeZone = "IST"; 

  const event = {
    summary: item.title,
    description: item.description,
    location: item.location || undefined,
    start: {
      dateTime: start.toISOString(),
      timeZone,
    },
    end: {
      dateTime: end.toISOString(),
      timeZone,
    },
    reminders: {
      useDefault: false,
      overrides: [
        {
          method: "popup",
          minutes: 2 * 24 * 60, // 2 days before
        },
      ],
    },
  };

  await calendar.events.insert({
    calendarId: "primary",
    requestBody: event,
  });
};

module.exports = { createCalendarEvent };

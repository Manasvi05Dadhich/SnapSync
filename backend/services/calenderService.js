const { google } = require("googleapis");

/**
 * Create a Google Calendar event for the given user and item.
 *
 * Expects:
 * - user.refreshToken to exist (for offline access)
 * - item.date in ISO format (YYYY-MM-DD) or parseable format
 * - item.time in 24-hour format (HH:mm) or parseable format
 * 
 * Throws errors if:
 * - User has no refresh token
 * - Date or time is missing
 * - Date/time cannot be parsed
 * - Calendar API call fails
 */
const createCalendarEvent = async (user, item) => {
  // Validate user has necessary tokens
  if (!user || !user.refreshToken) {
    throw new Error("Please reconnect your Google Calendar account to add events");
  }

  // Validate required date and time
  if (!item.date || !item.time) {
    throw new Error("Date and time are required to create a calendar event. Please ensure your screenshot includes this information.");
  }

  // Validate Google OAuth credentials
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("Google OAuth credentials not configured");
    throw new Error("Calendar integration is not properly configured");
  }

  // Setup OAuth2 client
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

  // Parse date and time - handle various formats
  let startDateTime;

  try {
    // Try ISO format first: YYYY-MM-DD + HH:mm
    const dateTimeString = `${item.date}T${item.time}:00`;
    startDateTime = new Date(dateTimeString);

    // Validate the parsed date
    if (isNaN(startDateTime.getTime())) {
      throw new Error("Invalid date format");
    }
  } catch (error) {
    console.error("Date parsing error:", { date: item.date, time: item.time, error: error.message });
    throw new Error(`Unable to parse date/time. Date: "${item.date}", Time: "${item.time}". Please ensure the screenshot has clear date and time information.`);
  }

  // End time is 1 hour after start by default
  const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

  // Use configurable timezone, default to Asia/Kolkata (IST)
  const timeZone = process.env.CALENDAR_TIMEZONE || "Asia/Kolkata";

  // Prepare event object
  const event = {
    summary: item.title,
    description: item.description || "Created via SnapSync",
    location: item.location || undefined,
    start: {
      dateTime: startDateTime.toISOString(),
      timeZone,
    },
    end: {
      dateTime: endDateTime.toISOString(),
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

  try {
    // Insert event into Google Calendar
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    console.log("Calendar event created successfully:", {
      eventId: response.data.id,
      htmlLink: response.data.htmlLink,
      title: item.title,
      startTime: startDateTime.toISOString(),
    });

    return response.data;
  } catch (error) {
    console.error("Google Calendar API error:", error.message);

    // Handle specific error cases
    if (error.code === 401 || error.message.includes("invalid_grant")) {
      throw new Error("Your Google Calendar connection has expired. Please reconnect your account.");
    }

    throw new Error(`Failed to create calendar event: ${error.message}`);
  }
};

module.exports = { createCalendarEvent };

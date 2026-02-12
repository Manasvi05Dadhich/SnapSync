const { google } = require("googleapis");


const createCalendarEvent = async (user, item) => {

  if (!user || !user.refreshToken) {
    throw new Error("Please reconnect your Google Calendar account to add events");
  }

  if (!item.date || !item.time) {
    throw new Error("Date and time are required to create a calendar event. Please ensure your screenshot includes this information.");
  }


  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    console.error("Google OAuth credentials not configured");
    throw new Error("Calendar integration is not properly configured");
  }


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


  let startDateTime;

  try {

    const dateTimeString = `${item.date}T${item.time}:00`;
    startDateTime = new Date(dateTimeString);

    if (isNaN(startDateTime.getTime())) {
      throw new Error("Invalid date format");
    }
  } catch (error) {
    console.error("Date parsing error:", { date: item.date, time: item.time, error: error.message });
    throw new Error(`Unable to parse date/time. Date: "${item.date}", Time: "${item.time}". Please ensure the screenshot has clear date and time information.`);
  }


  const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

  const timeZone = process.env.CALENDAR_TIMEZONE || "Asia/Kolkata";


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
    conferenceData: {
      createRequest: {
        requestId: `snapsync-${item._id || Date.now()}`,
        conferenceSolutionKey: { type: "hangoutsMeet" },
      },
    },
    reminders: {
      useDefault: false,
      overrides: [
        {
          method: "popup",
          minutes: 2 * 24 * 60,
        },
      ],
    },
  };

  try {

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
      conferenceDataVersion: 1,
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


    if (error.code === 401 || error.message.includes("invalid_grant")) {
      throw new Error("Your Google Calendar connection has expired. Please reconnect your account.");
    }

    throw new Error(`Failed to create calendar event: ${error.message}`);
  }
};

module.exports = { createCalendarEvent };

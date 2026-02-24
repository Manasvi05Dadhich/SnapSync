let google;
try {
  google = require('googleapis').google;
} catch (e) {
  console.warn('Google APIs not found. Calendar features will be disabled.');
}

const oauth2Client = google ? new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI || 'http://localhost:5000/api/auth/google/callback'
) : null;

/**
 * Create a Google Calendar event
 * @param {Object} tokens - User OAuth2 tokens { access_token, refresh_token }
 * @param {Object} item - Item data { title, date, description }
 * @returns {Promise<Object>} - Created event data
 */
const createCalendarEvent = async (tokens, item) => {
  if (!google) {
    throw new Error('Google Calendar integration is not active (missing dependencies). Please run npm install.');
  }
  try {
    oauth2Client.setCredentials({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary: item.title,
      description: item.description,
      start: {
        dateTime: item.date || new Date().toISOString(),
        timeZone: 'UTC',
      },
      end: {
        dateTime: item.date ? new Date(new Date(item.date).getTime() + 3600000).toISOString() : new Date(Date.now() + 3600000).toISOString(),
        timeZone: 'UTC',
      },
    };

    const response = await calendar.events.insert({
      calendarId: 'primary',
      resource: event,
    });

    return response.data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
};

/**
 * Get OAuth2 Client with refresh token
 * @param {string} refreshToken 
 * @returns {Object}
 */
const getClientWithToken = (refreshToken) => {
  if (!oauth2Client) return null;
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  return oauth2Client;
};

module.exports = {
  createCalendarEvent,
  getClientWithToken,
  isEnabled: !!google
};

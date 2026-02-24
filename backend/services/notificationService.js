const cron = require("node-cron");
const webpush = require("web-push");
const Item = require("../models/item");
const User = require("../models/users");


const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_EMAIL = process.env.VAPID_EMAIL || "mailto:admin@snapsync.app";

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
    try {
        if (typeof webpush.setVapidDetails === 'function') {
            webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
        } else {
            console.warn('webpush.setVapidDetails is not a function. Check web-push version.');
        }
    } catch (e) {
        console.warn('Failed to set VAPID details:', e.message);
    }
}


const NOTIFICATION_WINDOWS = [
    { key: "1day", minutes: 24 * 60, label: "tomorrow" },
    { key: "1hr", minutes: 60, label: "in 1 hour" },
    { key: "15min", minutes: 15, label: "in 15 minutes" },
];


function getItemDateTime(item) {
    if (!item.date || !item.time) return null;
    const dt = new Date(`${item.date}T${item.time}:00`);
    return isNaN(dt.getTime()) ? null : dt;
}


async function sendPushToUser(user, payload) {
    if (!user.pushSubscriptions || user.pushSubscriptions.length === 0) return;
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) return;

    const invalidIndexes = [];

    for (let i = 0; i < user.pushSubscriptions.length; i++) {
        try {
            await webpush.sendNotification(
                user.pushSubscriptions[i],
                JSON.stringify(payload)
            );
        } catch (err) {

            if (err.statusCode === 410 || err.statusCode === 404) {
                invalidIndexes.push(i);
            } else {
                console.error("Push notification error:", err.message);
            }
        }
    }


    if (invalidIndexes.length > 0) {
        user.pushSubscriptions = user.pushSubscriptions.filter(
            (_, i) => !invalidIndexes.includes(i)
        );
        await user.save();
    }
}

async function checkAndNotify() {
    try {
        const now = new Date();


        const items = await Item.find({
            date: { $ne: null },
            time: { $ne: null }
        });

        for (const item of items) {
            const eventTime = getItemDateTime(item);
            if (!eventTime || eventTime <= now) continue;

            const minutesUntil = (eventTime - now) / (1000 * 60);

            for (const window of NOTIFICATION_WINDOWS) {

                const alreadyNotified =
                    item.notifiedAt && item.notifiedAt.get(window.key);
                if (alreadyNotified) continue;


                if (minutesUntil <= window.minutes && minutesUntil > window.minutes - 2) {

                    const user = await User.findOne({ _id: item.userId });
                    if (!user) continue;

                    const typeLabel =
                        item.type === "event"
                            ? "Event"
                            : item.type === "task"
                                ? "Task"
                                : item.type === "reminder"
                                    ? "Reminder"
                                    : "Note";

                    const payload = {
                        title: `${typeLabel}: ${item.title}`,
                        body:
                            window.key === "1day"
                                ? `Tomorrow at ${item.time}`
                                : `Starts ${window.label} (${item.time})`,
                        icon: "/icon-192.png",
                        url: "/bucket",
                        tag: `${item._id}-${window.key}`,
                    };

                    await sendPushToUser(user, payload);


                    if (!item.notifiedAt) {
                        item.notifiedAt = new Map();
                    }
                    item.notifiedAt.set(window.key, new Date());
                    await item.save();

                    console.log(
                        `Notification sent: ${window.key} for "${item.title}" to user ${user.email}`
                    );
                }
            }
        }
    } catch (err) {
        console.error("Notification check error:", err.message);
    }
}


function startNotificationScheduler() {
    if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
        console.log("VAPID keys not configured — push notifications disabled");
        return;
    }


    cron.schedule("* * * * *", () => {
        checkAndNotify();
    });

    console.log("Notification scheduler started (checking every minute)");
}

module.exports = { startNotificationScheduler, sendPushToUser };

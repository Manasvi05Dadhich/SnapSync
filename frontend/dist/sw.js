

self.addEventListener("push", (event) => {
    if (!event.data) return;

    try {
        const data = event.data.json();

        const options = {
            body: data.body || "You have an upcoming item",
            icon: data.icon || "/icon-192.png",
            badge: "/icon-192.png",
            tag: data.tag || "snapsync-notification",
            data: { url: data.url || "/" },
            vibrate: [100, 50, 100],
            actions: [
                { action: "open", title: "Open SnapSync" },
                { action: "dismiss", title: "Dismiss" },
            ],
        };

        event.waitUntil(
            self.registration.showNotification(data.title || "SnapSync", options)
        );
    } catch (err) {
        console.error("Push event error:", err);
    }
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();

    if (event.action === "dismiss") return;

    const url = event.notification.data?.url || "/";

    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {

            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && "focus" in client) {
                    client.navigate(url);
                    return client.focus();
                }
            }

            return clients.openWindow(url);
        })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(self.clients.claim());
});

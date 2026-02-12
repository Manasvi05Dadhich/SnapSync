import { useState, useEffect, useCallback } from 'react';

export default function useNotifications() {
    const [supported, setSupported] = useState(false);
    const [permission, setPermission] = useState('default');
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const isSupported =
            'serviceWorker' in navigator &&
            'PushManager' in window &&
            'Notification' in window;

        setSupported(isSupported);

        if (isSupported) {
            setPermission(Notification.permission);


            navigator.serviceWorker.ready.then((reg) => {
                reg.pushManager.getSubscription().then((sub) => {
                    setSubscribed(!!sub);
                });
            });
        }
    }, []);

    const subscribe = useCallback(async () => {
        if (!supported) return false;
        setLoading(true);

        try {
            // Request notification permission
            const perm = await Notification.requestPermission();
            setPermission(perm);

            if (perm !== 'granted') {
                setLoading(false);
                return false;
            }

            // Register service worker
            const registration = await navigator.serviceWorker.register('/sw.js');
            await navigator.serviceWorker.ready;

            // Get VAPID public key from backend
            const keyRes = await fetch('/api/notifications/vapid-key', {
                credentials: 'include',
            });
            const { publicKey } = await keyRes.json();

            if (!publicKey) {
                console.error('VAPID public key not configured on server');
                setLoading(false);
                return false;
            }

            // Convert VAPID key to Uint8Array
            const applicationServerKey = urlBase64ToUint8Array(publicKey);

            // Subscribe to push
            const subscription = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey,
            });

            // Send subscription to backend
            await fetch('/api/notifications/subscribe', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ subscription: subscription.toJSON() }),
            });

            setSubscribed(true);
            setLoading(false);
            return true;
        } catch (err) {
            console.error('Failed to subscribe to notifications:', err);
            setLoading(false);
            return false;
        }
    }, [supported]);

    const unsubscribe = useCallback(async () => {
        if (!supported) return;
        setLoading(true);

        try {
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                // Remove from backend
                await fetch('/api/notifications/unsubscribe', {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ endpoint: subscription.endpoint }),
                });

                // Unsubscribe from browser
                await subscription.unsubscribe();
            }

            setSubscribed(false);
        } catch (err) {
            console.error('Failed to unsubscribe:', err);
        } finally {
            setLoading(false);
        }
    }, [supported]);

    return { supported, permission, subscribed, loading, subscribe, unsubscribe };
}

// Helper: Convert VAPID key from base64 to Uint8Array
function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

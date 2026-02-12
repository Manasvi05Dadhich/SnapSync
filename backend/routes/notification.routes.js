const express = require("express");
const protect = require("../middleware/protect");
const User = require("../models/users");

const router = express.Router();


router.post("/subscribe", protect, async (req, res) => {
    try {
        const { subscription } = req.body;

        if (!subscription || !subscription.endpoint) {
            return res.status(400).json({ message: "Invalid subscription" });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const exists = user.pushSubscriptions.some(
            (sub) => sub.endpoint === subscription.endpoint
        );

        if (!exists) {
            user.pushSubscriptions.push(subscription);
            await user.save();
        }

        res.json({ message: "Subscribed to notifications" });
    } catch (err) {
        console.error("Subscribe error:", err.message);
        res.status(500).json({ message: "Failed to subscribe", error: err.message });
    }
});

router.delete("/unsubscribe", protect, async (req, res) => {
    try {
        const { endpoint } = req.body;

        if (!endpoint) {
            return res.status(400).json({ message: "Endpoint required" });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.pushSubscriptions = user.pushSubscriptions.filter(
            (sub) => sub.endpoint !== endpoint
        );
        await user.save();

        res.json({ message: "Unsubscribed from notifications" });
    } catch (err) {
        res.status(500).json({ message: "Failed to unsubscribe", error: err.message });
    }
});


router.get("/vapid-key", (req, res) => {
    res.json({ publicKey: process.env.VAPID_PUBLIC_KEY || null });
});

module.exports = router;

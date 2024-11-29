require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const Stripe = require('stripe'); // Import Stripe

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); // Initialize Stripe with your secret key

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS
const allowedOrigins = ['https://biaw-stage.webflow.io'];
app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json()); // To parse JSON requests

// Route to create a Stripe Checkout session
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { clientReferenceId, priceId, seats } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: seats,
                },
            ],
            mode: 'payment',
            success_url: 'https://biaw-stage.webflow.io/thank-you',
            cancel_url: 'https://biaw-stage.webflow.io/payment-declined',
            client_reference_id: clientReferenceId,
            allow_promotion_codes: true, // Allow promo codes
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating checkout session:', error.message);
        res.status(500).json({ error: 'Failed to create checkout session' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const Stripe = require('stripe');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Allow Webflow and localhost during development
const allowedOrigins = ['https://new.biaw.com/', 'http://localhost:3000'];

// CORS configuration
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            // Allow requests with no origin (e.g., mobile apps or server-to-server)
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
}));

app.use(express.json());

// Endpoint to create a checkout session
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { seats, clientReferenceId, priceId } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: seats,
                },
            ],
            mode: 'payment',
            client_reference_id: clientReferenceId,
            success_url: 'https://new.biaw.com/thank-you',
            cancel_url: 'https://new.biaw.com/payment-declined',
            allow_promotion_codes: true, // Enable promo codes
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating checkout session:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

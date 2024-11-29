require('dotenv').config(); // Ensure this line is at the top if using a .env file
const express = require('express');
const cors = require('cors');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Access secret key

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for Webflow (replace with your Webflow domain)
const allowedOrigins = ['https://biaw-stage.webflow.io'];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json()); // To parse JSON requests

// Route to handle Stripe Checkout session creation
app.post('/create-checkout-session', async (req, res) => {
    try {
        const { priceId, quantity, clientReferenceId } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: quantity,
                },
            ],
            allow_promo_codes: true, // Enable promo codes
            client_reference_id: clientReferenceId,
            success_url: 'https://biaw-stage.webflow.io/thank-you',
            cancel_url: 'https://biaw-stage.webflow.io/payment-declined',
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error('Error creating Stripe session:', error);
        res.status(500).send('An error occurred while creating the session');
    }
});

// Existing route
app.post('/submit', (req, res) => {
    res.send('Form submitted successfully');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

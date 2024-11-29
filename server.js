const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for Webflow (replace with your Webflow domain)
const allowedOrigins = ['https://biaw-stage.webflow.io'];

app.use(cors({
    origin: allowedOrigins,  // Only allow Webflow domain
    methods: ['GET', 'POST'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
}));

app.use(express.json()); // To parse JSON requests

// Your existing routes
app.post('/submit', (req, res) => {
    // Handle form submission here
    res.send('Form submitted successfully');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

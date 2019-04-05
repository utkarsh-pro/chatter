const express = require('express');
const path = require('path');
const app = express();
const server = require('http').Server(app);
const Cors = require('cors');

// Setup server for CORS
app.use(Cors());
// Serving static react files
app.use(express.static(path.join(__dirname, 'client', 'build')));
// Port setup
const PORT = process.env.PORT || 5000;


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/api/test', (req, res) => {
    res.json({ "Hello": "World" });
});

server.listen(PORT, () => console.log("Server listening on port", PORT));
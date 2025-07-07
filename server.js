// server.js (root proyek)
// server.js
try {
    require('dotenv').config();
} catch (err) {
    console.warn('[WARN] .env file not loaded, relying on Railway ENV variables');
}

const app = require('./src/app');
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`✅ Server berjalan di http://localhost:${PORT}`);
});

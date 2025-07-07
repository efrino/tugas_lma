// server.js (root proyek)
const app = require('./src/app');
const dotenv = require('@dotenvx/dotenvx');
dotenv.config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
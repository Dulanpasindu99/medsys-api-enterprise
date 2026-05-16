const path = require('path');
const backendPath = './apps/api/dist/apps/api/src/index.js';

// --- AUTO-FIX PEM KEYS ---
function fixPem(key) {
    if (!key || key.includes('\n')) return key;
    // This adds the newlines back if Hostinger stripped them
    return key.replace(/-----BEGIN [A-Z ]+-----/, "$&\n")
              .replace(/-----END [A-Z ]+-----/, "\n$&")
              .replace(/([^\n]{64})/g, "$1\n");
}

process.env.JWT_ACCESS_PRIVATE_KEY = fixPem(process.env.JWT_ACCESS_PRIVATE_KEY);
process.env.JWT_ACCESS_PUBLIC_KEY = fixPem(process.env.JWT_ACCESS_PUBLIC_KEY);
process.env.JWT_REFRESH_PRIVATE_KEY = fixPem(process.env.JWT_REFRESH_PRIVATE_KEY);
process.env.JWT_REFRESH_PUBLIC_KEY = fixPem(process.env.JWT_REFRESH_PUBLIC_KEY);
// -------------------------

process.on('uncaughtException', (err) => {
    console.error('!!! UNCAUGHT EXCEPTION !!!', err);
});

console.log("--- PROXY STARTING (WITH PEM FIX) ---");

async function start() {
    try {
        require(backendPath);
        console.log("Backend required.");
    } catch (e) {
        console.error("REQUIRE ERROR:", e);
    }
}

setInterval(() => { console.log("Heartbeat..."); }, 30000);
start();

const http = require('http');
const { Client } = require('pg');
const backendPath = './apps/api/dist/apps/api/src/index.js';

async function testDb() {
    console.log("--- TESTING DATABASE CONNECTION ---");
    const client = new Client({ connectionString: process.env.DATABASE_URL });
    try {
        await client.connect();
        console.log("✅ DATABASE CONNECTION SUCCESSFUL!");
        await client.end();
    } catch (err) {
        console.error("❌ DATABASE CONNECTION FAILED:", err.message);
    }
}

// ... (Keep the PEM fix and Traffic Monitor logic from before) ...
const oldCreateServer = http.createServer;
http.createServer = function(handler) {
    return oldCreateServer.call(this, (req, res) => {
        console.log(`>>> HIT: ${req.method} ${req.url}`);
        return handler(req, res);
    });
};

function fixPem(key) {
    if (!key || key.includes('\n')) return key;
    return key.replace(/-----BEGIN [A-Z ]+-----/, "$&\n")
              .replace(/-----END [A-Z ]+-----/, "\n$&")
              .replace(/([^\n]{64})/g, "$1\n");
}
process.env.JWT_ACCESS_PRIVATE_KEY = fixPem(process.env.JWT_ACCESS_PRIVATE_KEY);
process.env.JWT_ACCESS_PUBLIC_KEY = fixPem(process.env.JWT_ACCESS_PUBLIC_KEY);
process.env.JWT_REFRESH_PRIVATE_KEY = fixPem(process.env.JWT_REFRESH_PRIVATE_KEY);
process.env.JWT_REFRESH_PUBLIC_KEY = fixPem(process.env.JWT_REFRESH_PUBLIC_KEY);

console.log("--- PROXY STARTING ---");

async function start() {
    await testDb();
    try {
        require(backendPath);
        console.log("Backend required.");
    } catch (e) {
        console.error("REQUIRE ERROR:", e);
    }
}
setInterval(() => { console.log("Heartbeat..."); }, 30000);
start();

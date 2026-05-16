console.log("--- PROXY STARTING ---");
console.log("Current Directory:", __dirname);

// The deep path we found in the screenshots
const deepPath = './apps/api/dist/apps/api/src/index.js';

try {
    console.log("Attempting to load backend from:", deepPath);
    require(deepPath);
    console.log("--- BACKEND LOADED SUCCESSFULLY ---");
} catch (err) {
    console.error("!!! CRITICAL ERROR STARTING BACKEND !!!");
    console.error(err);
    process.exit(1);
}

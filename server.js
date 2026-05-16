const fs = require('fs');
const path = require('path');

console.log("--- DEBUG: LOOKING IN .BUILDS ---");
try {
    const buildsPath = path.join(__dirname, '..', 'public_html', '.builds');
    if (fs.existsSync(buildsPath)) {
        console.log("Inside .builds:", fs.readdirSync(buildsPath));
        
        // If there is a "last-source" or similar folder inside .builds, let's look there
        const subFolders = fs.readdirSync(buildsPath);
        subFolders.forEach(folder => {
             const subPath = path.join(buildsPath, folder);
             if (fs.lstatSync(subPath).isDirectory()) {
                 console.log(`Inside .builds/${folder}:`, fs.readdirSync(subPath));
             }
        });
    }
} catch (e) {
    console.error("Search failed:", e);
}

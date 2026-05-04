const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data.json');

// Lire le fichier data.json s'il existe, sinon créer un template
let data = {
    token: "",
    id: "",
    host: "",
    text: ""
};

if (fs.existsSync(dataPath)) {
    try {
        const raw = fs.readFileSync(dataPath, 'utf8');
        data = JSON.parse(raw);
    } catch(e) {
        console.log('Erreur lecture data.json, création d\'un nouveau');
    }
}

// Surcharger avec les variables d'environnement (Render)
if (process.env.TOKEN) data.token = process.env.TOKEN;
if (process.env.CHAT_ID) data.id = process.env.CHAT_ID;
if (process.env.HOST) data.host = process.env.HOST;

// Sauvegarder
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('✅ data.json mis à jour');
console.log('   Token:', data.token ? '✅ présent' : '❌ manquant');
console.log('   Chat ID:', data.id ? '✅ présent' : '❌ manquant');
console.log('   Host:', data.host || '⚠️ vide (utilise localhost:3000)');

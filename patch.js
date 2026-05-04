const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data.json');

let data = { token: "", id: "", host: "", text: "" };

if (fs.existsSync(dataPath)) {
    try {
        data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        console.log('📖 data.json existant chargé');
    } catch(e) {
        console.log('⚠️ Erreur lecture data.json, création d\'un nouveau');
    }
} else {
    console.log('📝 data.json inexistant, création du template');
}

if (process.env.TOKEN) {
    data.token = process.env.TOKEN;
    console.log('✅ Token chargé depuis variable TOKEN');
}
if (process.env.CHAT_ID) {
    data.id = process.env.CHAT_ID;
    console.log('✅ Chat ID chargé depuis variable CHAT_ID');
}
if (process.env.HOST) {
    data.host = process.env.HOST;
    console.log('✅ Host chargé depuis variable HOST');
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('💾 data.json sauvegardé');
console.log('   📍 Host:', data.host || '⚠️ non défini');

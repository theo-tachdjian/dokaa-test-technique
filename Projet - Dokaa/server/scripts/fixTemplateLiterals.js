const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../services/deliverooGraphQL.js');
let content = fs.readFileSync(filePath, 'utf8');

const problematicPatterns = [
  [/console\.log\(`⚠️  Rate limiting détecté pour \$\{city\} - Le cache sera utilisé`\);/g, "console.log('Rate limiting detecte pour ' + city + ' - Le cache sera utilise');"],
  [/console\.log\(`⚠️  /g, "console.log('"),
  [/console\.log\(`✅ /g, "console.log('"),
  [/console\.log\(`❌ /g, "console.log('"),
  [/console\.log\(`🔍 /g, "console.log('"),
  [/console\.log\(`⏳ /g, "console.log('"),
  [/console\.log\(`💡 /g, "console.log('"),
  [/console\.log\(`📋 /g, "console.log('"),
  [/console\.log\(`📊 /g, "console.log('"),
  [/console\.log\(`🏙 /g, "console.log('"),
  [/console\.log\(`🚀 /g, "console.log('"),
  [/console\.log\(`✓ /g, "console.log('"),
  [/console\.error\(`⚠️  /g, "console.error('"),
  [/console\.error\(`❌ /g, "console.error('"),
  [/console\.error\(`💡 /g, "console.error('"),
  [/console\.error\(`📋 /g, "console.error('"),
  [/console\.warn\(`⚠ /g, "console.warn('"),
];

for (const [pattern, replacement] of problematicPatterns) {
  content = content.replace(pattern, replacement);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Template literals corriges');


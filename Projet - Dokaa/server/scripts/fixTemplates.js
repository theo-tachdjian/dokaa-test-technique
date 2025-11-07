const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../services/deliverooGraphQL.js');
let content = fs.readFileSync(filePath, 'utf8');

content = content.replace(/console\.log\(`([^`]+)`\)/g, (match, template) => {
  let result = template.replace(/\$\{([^}]+)\}/g, "' + $1 + '");
  result = result.replace(/[⚠✅❌🔍⏳💡📋📊🏙🚀✓✗]/g, '');
  result = result.replace(/\s+/g, ' ').trim();
  return "console.log('" + result + "')";
});

content = content.replace(/console\.error\(`([^`]+)`\)/g, (match, template) => {
  let result = template.replace(/\$\{([^}]+)\}/g, "' + $1 + '");
  result = result.replace(/[⚠✅❌🔍⏳💡📋📊🏙🚀✓✗]/g, '');
  result = result.replace(/\s+/g, ' ').trim();
  return "console.error('" + result + "')";
});

content = content.replace(/console\.warn\(`([^`]+)`\)/g, (match, template) => {
  let result = template.replace(/\$\{([^}]+)\}/g, "' + $1 + '");
  result = result.replace(/[⚠✅❌🔍⏳💡📋📊🏙🚀✓✗]/g, '');
  result = result.replace(/\s+/g, ' ').trim();
  return "console.warn('" + result + "')";
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('Tous les template literals ont ete corriges');


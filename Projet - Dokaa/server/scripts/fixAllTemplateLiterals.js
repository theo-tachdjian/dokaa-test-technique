const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../services/deliverooGraphQL.js');
let content = fs.readFileSync(filePath, 'utf8');

const lines = content.split('\n');
const fixedLines = [];

for (let i = 0; i < lines.length; i++) {
  let line = lines[i];
  
  if (line.includes('console.log(`') || line.includes('console.error(`') || line.includes('console.warn(`')) {
    const emojiPatterns = ['⚠️', '✅', '❌', '🔍', '⏳', '💡', '📋', '📊', '🏙', '🚀', '✓', '✗'];
    let hasEmoji = false;
    for (const emoji of emojiPatterns) {
      if (line.includes(emoji)) {
        hasEmoji = true;
        break;
      }
    }
    
    if (hasEmoji && line.includes('${')) {
      line = line.replace(/console\.log\(`([^`]*)`\)/g, (match, template) => {
        let result = template.replace(/\$\{([^}]+)\}/g, "' + $1 + '");
        result = result.replace(/⚠️|✅|❌|🔍|⏳|💡|📋|📊|🏙|🚀|✓|✗/g, '');
        result = result.replace(/\s+/g, ' ').trim();
        return "console.log('" + result + "')";
      });
      
      line = line.replace(/console\.error\(`([^`]*)`\)/g, (match, template) => {
        let result = template.replace(/\$\{([^}]+)\}/g, "' + $1 + '");
        result = result.replace(/⚠️|✅|❌|🔍|⏳|💡|📋|📊|🏙|🚀|✓|✗/g, '');
        result = result.replace(/\s+/g, ' ').trim();
        return "console.error('" + result + "')";
      });
      
      line = line.replace(/console\.warn\(`([^`]*)`\)/g, (match, template) => {
        let result = template.replace(/\$\{([^}]+)\}/g, "' + $1 + '");
        result = result.replace(/⚠️|✅|❌|🔍|⏳|💡|📋|📊|🏙|🚀|✓|✗/g, '');
        result = result.replace(/\s+/g, ' ').trim();
        return "console.warn('" + result + "')";
      });
    }
  }
  
  fixedLines.push(line);
}

fs.writeFileSync(filePath, fixedLines.join('\n'), 'utf8');
console.log('Template literals corriges');


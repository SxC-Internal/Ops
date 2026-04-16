const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('route.ts')) results.push(file);
    }
  });
  return results;
}

const files = walk(path.join(__dirname, 'app/api'));

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Single-line or multi-line signature
  const sigRegex = /export async function ([A-Z]+)\(([^,]+),\s*\{\s*params\s*\}:\s*\{\s*params:\s*\{([^}]+)\}\s*\}\s*\)\s*\{/g;
  
  content = content.replace(sigRegex, (match, method, reqArg, paramType) => {
    changed = true;
    const typeStr = paramType.trim();
    const keys = typeStr.split(';').map(s => s.split(':')[0].trim()).filter(Boolean);
    const awaitLine = `  const { ${keys.join(', ')} } = await params;`;
    
    return `export async function ${method}(${reqArg}, { params }: { params: Promise<{ ${typeStr} }> }) {\n${awaitLine}`;
  });

  if (changed) {
    content = content.replace(/params\.id/g, 'id');
    content = content.replace(/params\.fileId/g, 'fileId');
    fs.writeFileSync(file, content);
    console.log('Fixed', file);
  }
});
console.log('All done');

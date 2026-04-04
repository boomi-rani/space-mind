const fs = require('fs');
const path = require('path');
const dir = __dirname;
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add Mission Control next to Gallery
  if (!content.includes('mission-control.html')) {
    content = content.replace(/<a href="gallery\.html"(.*?)>Gallery<\/a>/, 
      '<a href="gallery.html"$1>Gallery</a>\n        <a href="mission-control.html">Mission Control</a>');
  }
    
  // Add Theme Toggle button
  if (!content.includes('theme-toggle')) {
    content = content.replace(/(<a href="auth\.html".*?Sign In<\/a>)/, 
      '$1\n        <button id="theme-toggle" class="btn" style="padding: 0.5rem 1rem; border: 1px solid rgba(255,255,255,0.3); background: transparent; color: inherit; border-radius: 4px; cursor:pointer;" title="Cleanroom Mode">🔆</button>');
  }
  
  fs.writeFileSync(filePath, content);
});
console.log('HTML files updated with new nav items.');

const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/Hp/.gemini/antigravity/scratch/spaceminds';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
  let content = fs.readFileSync(path.join(dir, file), 'utf8');

  // Insert theme.js script if not there
  if (!content.includes('assets/js/theme.js')) {
      content = content.replace('</body>', '  <script src="assets/js/theme.js"></script>\n</body>');
  }

  // Insert theme toggle button
  if (!content.includes('theme-toggle')) {
      // Find where nav-links close. Usually after Sign In link.
      // Search for: <div class="nav-links">...</div>
      // So replacing `      </div>\n    </div>\n  </nav>` is safer, or replacing `</nav>`.
      // Let's replace the inner div closing tag of nav-links.
      // Let's replace `class="btn btn-primary" style="padding: 0.5rem 1.5rem; margin-left: 1rem;">Sign In</a>` 
      // OR in index.html `class="btn btn-primary" style="padding: 0.5rem 1.5rem; margin-left: 1rem;">Sign In</a>`
      
      const themeBtn = `\n        <button class="theme-toggle" style="background:none; border:none; padding:0 1rem; font-size:1.2rem; cursor:pointer;" title="Toggle Cleanroom Mode">☀️</button>\n      </div>`;
      content = content.replace(/<\/div>\s*<button class="mobile-menu-btn">/, themeBtn + '\n      <button class="mobile-menu-btn">');
      
      // Specifically for gallery.html which misses the mobile button!
      if (file === 'gallery.html') {
          // gallery doesn't have mobile button
          content = content.replace(/<\/div>\s*<\/div>\s*<\/nav>/, themeBtn + '\n      <button class="mobile-menu-btn">☰</button>\n    </div>\n  </nav>');
      }
  }

  // For gallery.html missing mobile button specifically if it already had theme (redundant check)
  if (file === 'gallery.html' && !content.includes('mobile-menu-btn')) {
      content = content.replace(/<\/div>\s*<\/div>\s*<\/nav>/, '\n      </div>\n      <button class="mobile-menu-btn">☰</button>\n    </div>\n  </nav>');
  }

  fs.writeFileSync(path.join(dir, file), content);
});

console.log("Injection complete.");

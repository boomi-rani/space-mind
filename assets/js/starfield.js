// starfield.js - Interactive Cursor Space Background
class Starfield {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    // Mouse tracking
    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    
    // Entities
    this.stars = [];
    this.shootingStars = [];
    this.planets = [];
    this.numStars = 500; 
    
    this.init();
    
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    });
    
    this.animate();
  }

  init() {
    this.resize();
    this.stars = [];
    this.shootingStars = [];
    this.planets = [];
    
    // Initialize Twinkling Stars
    for (let i = 0; i < this.numStars; i++) {
        this.stars.push({
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            radius: Math.random() * 1.2 + 0.2,
            baseAlpha: Math.random() * 0.4 + 0.1,
            speedX: (Math.random() - 0.5) * 0.1,
            speedY: Math.random() * 0.05 + 0.02,
            twinkleSpeed: Math.random() * 0.03 + 0.01,
            twinklePhase: Math.random() * Math.PI * 2
        });
    }

    // Initialize Subtle Planets
    for (let i = 0; i < 3; i++) {
        this.planets.push({
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            z: Math.random() * 2 + 1, // Depth for parallax
            radius: Math.random() * 60 + 20,
            baseX: Math.random() * this.canvas.width,
            baseY: Math.random() * this.canvas.height,
            colorPhase: i
        });
    }
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  spawnShootingStar(x, y, angleObj) {
      this.shootingStars.push({
          x: x || Math.random() * this.canvas.width,
          y: y || 0,
          length: Math.random() * 60 + 30,
          speed: Math.random() * 10 + 6,
          angle: angleObj || (Math.PI / 4 + (Math.random() * 0.4 - 0.2)),
          opacity: 1
      });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Mouse Parallax Offset
    let mxOffset = (this.mouseX - this.canvas.width / 2) * 0.02;
    let myOffset = (this.mouseY - this.canvas.height / 2) * 0.02;

    // Render Planets with Parallax
    for (let i = 0; i < this.planets.length; i++) {
        let p = this.planets[i];
        
        // Parallax movement based on Z depth
        p.x = p.baseX - (mxOffset * p.z);
        p.y = p.baseY - (myOffset * p.z);

        let gradient = this.ctx.createRadialGradient(
            p.x - p.radius * 0.2, p.y - p.radius * 0.2, p.radius * 0.1, 
            p.x, p.y, p.radius
        );
        
        if (p.colorPhase === 0) {
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.04)');
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        } else if (p.colorPhase === 1) {
            gradient.addColorStop(0, 'rgba(0, 150, 255, 0.03)');
            gradient.addColorStop(1, 'rgba(0, 150, 255, 0)');
        } else {
            gradient.addColorStop(0, 'rgba(200, 100, 255, 0.02)');
            gradient.addColorStop(1, 'rgba(200, 100, 255, 0)');
        }

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();
    }

    // Render Twinkling Stars
    for (let i = 0; i < this.stars.length; i++) {
        let star = this.stars[i];
        
        // Base Drift
        star.y -= star.speedY;
        star.x += star.speedX;
        
        if (star.y < 0) star.y = this.canvas.height;
        if (star.x < 0) star.x = this.canvas.width;
        if (star.x > this.canvas.width) star.x = 0;
        
        // Mouse interaction logic
        let dx = this.mouseX - star.x;
        let dy = this.mouseY - star.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        
        let interactionAlpha = 0;
        if (dist < 150) {
            interactionAlpha = (150 - dist) / 150; // Boost opacity near cursor
            // Push away slightly
            star.x -= (dx / dist) * 0.5;
            star.y -= (dy / dist) * 0.5;
        }

        // Twinkle calculation
        star.twinklePhase += star.twinkleSpeed;
        let currentAlpha = star.baseAlpha + Math.sin(star.twinklePhase) * 0.2 + interactionAlpha;
        if (currentAlpha < 0) currentAlpha = 0;
        if (currentAlpha > 1) currentAlpha = 1;

        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.radius + (interactionAlpha * 0.5), 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha})`;
        this.ctx.fill();
    }

    // Interactive Shooting Stars (spawn them occasionally near mouse)
    if (Math.random() < 0.02) { 
        // 1 in 50 frames to casually spawn shooting star organically
        this.spawnShootingStar();
    }
    // Very rarely shoot one originating near mouse
    if (Math.random() < 0.005) { 
        this.spawnShootingStar(this.mouseX + (Math.random()*100-50), this.mouseY + (Math.random()*100-50));
    }

    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
        let ss = this.shootingStars[i];
        
        ss.x -= Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.opacity -= 0.02;

        if (ss.opacity <= 0) {
            this.shootingStars.splice(i, 1);
            continue;
        }

        let gradient = this.ctx.createLinearGradient(
            ss.x, ss.y, 
            ss.x + Math.cos(ss.angle) * ss.length, 
            ss.y - Math.sin(ss.angle) * ss.length
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${ss.opacity})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

        this.ctx.beginPath();
        this.ctx.moveTo(ss.x, ss.y);
        this.ctx.lineTo(ss.x + Math.cos(ss.angle) * ss.length, ss.y - Math.sin(ss.angle) * ss.length);
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();
    }
    
    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new Starfield('starfield-canvas');
});

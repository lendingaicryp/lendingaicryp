class Particle {
    constructor(x, y, size, speed) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.speed = speed;
      this.angle = Math.random() * 360;
    }
  
    update(width, height, scrollSpeed, mouseX, mouseY) {
      this.y += Math.sin(this.angle) * this.speed + scrollSpeed * 0.1;
      this.x += Math.cos(this.angle) * this.speed;
  
      // Mouse interaction
      const dx = mouseX - this.x;
      const dy = mouseY - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < 100) {
        this.x -= dx * 0.01;
        this.y -= dy * 0.01;
      }
  
      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;
    }
  
    draw(ctx) {
      ctx.fillStyle = 'rgba(0, 100, 255, 0.5)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  class ParticleSystem {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.particles = [];
      this.mouseX = 0;
      this.mouseY = 0;
      this.scrollSpeed = 0;
      this.lastScrollTop = 0;
  
      this.resize();
      this.createParticles();
      this.bindEvents();
    }
  
    resize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    }
  
    createParticles() {
      const particleCount = Math.floor(this.canvas.width * this.canvas.height / 10000);
      for (let i = 0; i < particleCount; i++) {
        this.particles.push(new Particle(
          Math.random() * this.canvas.width,
          Math.random() * this.canvas.height,
          Math.random() * 2 + 1,
          Math.random() * 0.5 + 0.1
        ));
      }
    }
  
    bindEvents() {
      window.addEventListener('resize', () => this.resize());
      window.addEventListener('scroll', () => {
        const st = window.pageYOffset || document.documentElement.scrollTop;
        this.scrollSpeed = st - this.lastScrollTop;
        this.lastScrollTop = st <= 0 ? 0 : st;
      });
      window.addEventListener('mousemove', (e) => {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
      });
    }
  
    update() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.particles.forEach(particle => {
        particle.update(this.canvas.width, this.canvas.height, this.scrollSpeed, this.mouseX, this.mouseY);
        particle.draw(this.ctx);
      });
      this.scrollSpeed *= 0.9;
      requestAnimationFrame(() => this.update());
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particleCanvas');
    const particleSystem = new ParticleSystem(canvas);
    particleSystem.update();
  });
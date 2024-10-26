class CustomCursor {
    constructor() {
      this.dot = document.getElementById('custom-cursor-dot');
      this.ring = document.getElementById('custom-cursor-ring');
      this.mouseX = 0;
      this.mouseY = 0;
      this.dotX = 0;
      this.dotY = 0;
      this.ringX = 0;
      this.ringY = 0;
      this.init();
    }
  
    init() {
      document.addEventListener('mousemove', (e) => this.updateMousePosition(e));
      this.animate();
    }
  
    updateMousePosition(e) {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    }
  
    animate() {
      // Update dot position
      this.dotX += (this.mouseX - this.dotX) * 0.2;
      this.dotY += (this.mouseY - this.dotY) * 0.2;
  
      // Update ring position
      this.ringX += (this.mouseX - this.ringX) * 0.1;
      this.ringY += (this.mouseY - this.ringY) * 0.1;
  
      // Apply transformations
      this.dot.style.transform = `translate(${this.dotX}px, ${this.dotY}px)`;
      this.ring.style.transform = `translate(${this.ringX}px, ${this.ringY}px)`;
  
      requestAnimationFrame(() => this.animate());
    }
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    new CustomCursor();
  });
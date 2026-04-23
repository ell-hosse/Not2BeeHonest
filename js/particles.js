/* Bioluminescent Firefly Particle System */
(function () {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], animId;
  const COUNT = 80;

  const COLORS = [
    [0, 255, 136],   // green
    [6, 200, 212],   // cyan
    [124, 58, 237],  // purple
    [0, 200, 255],   // blue
  ];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  class Particle {
    constructor() { this.reset(true); }

    reset(initial = false) {
      this.x  = rand(0, W);
      this.y  = initial ? rand(0, H) : (Math.random() > 0.5 ? -10 : H + 10);
      this.vx = rand(-0.2, 0.2);
      this.vy = rand(-0.3, 0.3);
      this.r  = rand(1, 3);
      this.alpha = 0;
      this.targetAlpha = rand(0.3, 0.9);
      this.fadeSpeed   = rand(0.005, 0.02);
      this.life = rand(200, 600);
      this.age  = initial ? rand(0, this.life) : 0;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.wobble = rand(0, Math.PI * 2);
      this.wobbleSpeed = rand(0.01, 0.04);
    }

    update() {
      this.age++;
      this.wobble += this.wobbleSpeed;
      this.x += this.vx + Math.sin(this.wobble * 1.3) * 0.15;
      this.y += this.vy + Math.cos(this.wobble) * 0.15;

      const progress = this.age / this.life;
      if (progress < 0.2) {
        this.alpha = Math.min(this.alpha + this.fadeSpeed, this.targetAlpha * (progress / 0.2));
      } else if (progress > 0.8) {
        this.alpha = Math.max(0, this.alpha - this.fadeSpeed * 1.5);
      } else {
        this.alpha += (this.targetAlpha - this.alpha) * 0.05;
      }

      if (this.age > this.life) this.reset();
    }

    draw() {
      const [r, g, b] = this.color;
      // glow
      const grd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 6);
      grd.addColorStop(0,   `rgba(${r},${g},${b},${this.alpha * 0.8})`);
      grd.addColorStop(0.4, `rgba(${r},${g},${b},${this.alpha * 0.3})`);
      grd.addColorStop(1,   `rgba(${r},${g},${b},0)`);
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r * 6, 0, Math.PI * 2);
      ctx.fillStyle = grd;
      ctx.fill();
      // core
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r},${g},${b},${this.alpha})`;
      ctx.fill();
    }
  }

  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 255, 136, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function init() {
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(animate);
  }

  resize();
  init();
  animate();

  window.addEventListener('resize', () => { resize(); });
})();
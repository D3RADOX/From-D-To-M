const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
const heartPoints = 100;

function heartShape(t) {
  const x = 16 * Math.pow(Math.sin(t), 3);
  const y = 13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t);
  return { x, y };
}

function createHeartParticles() {
  const width = canvas.width / 2;
  const height = canvas.height / 2;
  for (let i = 0; i < heartPoints; i++) {
    const t = (i / heartPoints) * 2 * Math.PI;
    const { x, y } = heartShape(t);
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      tx: width + x * 10,
      ty: height - y * 10,
      radius: 2,
      color: `hsl(${Math.random() * 360}, 100%, 70%)`,
    });
  }
}

function animateParticles(step = 0) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let p of particles) {
    p.x += (p.tx - p.x) * 0.05;
    p.y += (p.ty - p.y) * 0.05;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
  }
  if (step < 80) {
    requestAnimationFrame(() => animateParticles(step + 1));
  } else {
    document.getElementById("final-message").classList.remove("hidden");
  }
}

function sequenceStart() {
  setTimeout(() => {
    document.getElementById("first-message").style.display = "none";
    createHeartParticles();
    animateParticles();
  }, 3000);
}

sequenceStart();
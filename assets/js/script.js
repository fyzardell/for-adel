/* ================= SCENES ================= */
const scenes = [
  { text: "3", duration: 1800 },
  { text: "2", duration: 1500 },
  { text: "1", duration: 1500 },
  { text: "Happy Birthday Adel", duration: 2200 },
  { text: "08.02.07", duration: 1700, switchRain: true },
  { text: "Happy 19+", duration: 2000 },
];

window.addEventListener("pageshow", (e) => {
  if (e.persisted) {
    location.reload();
  }
});

/* ================= CANVAS ================= */
const rainCanvas = document.getElementById("rain");
const rainCtx = rainCanvas.getContext("2d");

const particleCanvas = document.getElementById("particles");
const ctx = particleCanvas.getContext("2d");

/* ================= RESIZE ================= */
const fontSize = 18;
let columns, drops;

function resize() {
  rainCanvas.width = innerWidth;
  rainCanvas.height = innerHeight;

  particleCanvas.width = innerWidth;
  particleCanvas.height = innerHeight;

  columns = Math.floor(rainCanvas.width / fontSize);
  drops = Array(columns).fill(1);
}
resize();
addEventListener("resize", resize);

/* ================= MATRIX RAIN ================= */
let rainChars = ["0", "1"];

function drawRain() {
  rainCtx.fillStyle = "rgba(0,0,0,0.03)";
  rainCtx.fillRect(0, 0, rainCanvas.width, rainCanvas.height);

  rainCtx.fillStyle = "rgba(225,182,193,0.8)";
  rainCtx.font = `${fontSize}px 'Share Tech Mono'`;

  for (let i = 0; i < drops.length; i++) {
    const char = rainChars[Math.random() * rainChars.length | 0];
    rainCtx.fillText(char, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > rainCanvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i] += Math.random() + 0.3;
  }
}

/* ================= PARTICLES ================= */
let particles = [];

class Particle {
  constructor(x, y) {
    this.x = Math.random() * particleCanvas.width;
    this.y = Math.random() * particleCanvas.height;
    this.tx = x;
    this.ty = y;
    this.size = Math.random() * 3 + 3;
    this.alpha = 0;
    this.targetAlpha = 1;
  }

  update() {
    this.x += (this.tx - this.x) * 0.08;
    this.y += (this.ty - this.y) * 0.08;
    this.alpha += (this.targetAlpha - this.alpha) * 0.05;
  }

draw() {
  ctx.save();

  ctx.globalAlpha = this.alpha;

  // warna utama
  ctx.fillStyle = "#fba7cd";

  // glow / shadow
  ctx.shadowColor = "rgba(255, 201, 225, 0.56)";
  ctx.shadowBlur = 7;

  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
  }
}

function createTextParticles(text) {
  particles = [];

  ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
  ctx.fillStyle = "#fff";

  // BEDAIN UKURAN PARTIKEL
  if (["3", "2", "1"].includes(text)) {
    ctx.font = "140px Poppins";   // 321
  } else {
    ctx.font = "90px Poppins";   // text biasa
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, particleCanvas.width / 2, particleCanvas.height / 2);

  const imageData = ctx.getImageData(
    0,
    0,
    particleCanvas.width,
    particleCanvas.height
  ).data;
  
  for (let y = 0; y < particleCanvas.height; y += 4) {
    for (let x = 0; x < particleCanvas.width; x += 4) {
      const i = (y * particleCanvas.width + x) * 4;
      if (imageData[i + 3] > 128) {
        particles.push(new Particle(x, y));
      }
    }
  }

  ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
}

function scatterParticles() {
  particles.forEach(p => {
    p.tx = Math.random() * particleCanvas.width;
    p.ty = Math.random() * particleCanvas.height;
    p.targetAlpha = 0;
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ================= SCENE CONTROLLER ================= */
let sceneIndex = 0;
let rainMode = "binary"; 

function runScene() {
  if (sceneIndex >= scenes.length) return;

  const scene = scenes[sceneIndex];

// RAIN SWITCH
if (scene.text === "Happy Birthday Adel" || scene.switchRain) {
  rainMode = "happy";
}

if (rainMode === "happy") {
  rainChars = ["H","A","P","P","Y","B","I","R","T","H","D","A","Y"];
} else {
  rainChars = ["0","1"];
}

if (scene.text === "Happy 19+") {
  setTimeout(() => {
    document.body.classList.add("fade-out");
    document.getElementById("fadeOverlay").style.opacity = 1;

    setTimeout(() => {
      window.location.assign("prize.html"); //halaman lanjutan
    }, 1200);
  }, scene.duration - 300);
}
  // PARTICLES
  createTextParticles(scene.text);

  setTimeout(() => {
    scatterParticles();
    sceneIndex++;
    setTimeout(runScene, 600);
  }, scene.duration);
}

/* ================= LOADING STATE ================= */
let isLoaded = false;
let rainInterval = null;

window.addEventListener("load",  () => {
  const loading = document.getElementById("loading");

  //delay
  setTimeout(() => {
    loading.classList.add("hide");

    startExperience(); 
  }, 800);
});

function startExperience() {
  if (isLoaded) return;
  isLoaded = true;

  // mulai hujan
  rainInterval = setInterval(drawRain, 33);

  // mulai scene
  runScene();
}
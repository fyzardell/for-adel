const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let stars = [];

function resize() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);

//bikin bintang
function createStars(count = 140) {
  stars = [];
  for (let i = 0; i < count; i++) {
      stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 1.5 + 0.5,
            alpha: Math.random(),
            speed: Math.random() * 0.02 + 0.01,
            type: Math.random() > 0.75 ? "sparkle" : "dot"
      });
   }
}
createStars();

//sparkle
function drawSparkle(x, y, size, alpha) {
    ctx.save();
    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
    ctx.lineWidth = 1;
    ctx.shadowColor = "rgba(255,255,255,0.6)";
    ctx.shadowBlur = 8;

    ctx.beginPath();
    ctx.moveTo(x - size, y);
    ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size);
    ctx.lineTo(x, y + size);
    ctx.stroke();

    ctx.restore();
}

//animasi
function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(s => {
        s.alpha += s.speed;
        if (s.alpha > 1 || s.alpha < 0) s.speed *= -1;

        if (s.type === "dot") {
            ctx.fillStyle = `rgba(255, 220, 120, ${s.alpha})`;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fill();
    } else {
        drawSparkle(s.x, s.y, s.r * 3, s.alpha);
        }
    });

    requestAnimationFrame(drawStars);
}
drawStars();

const gift = document.getElementById("gift");
const hint = document.getElementById("hint");

let tapCount = 0;
let exploded = false;

gift.addEventListener("click", () => {
    if (exploded) return;

    tapCount++;

    if (tapCount === 1) {
        gift.classList.remove("shake-2");
        gift.classList.add("shake-1");
        hint.textContent = "Nice! keep taping";
    }

    if (tapCount === 2) {
        gift.classList.remove("shake-1");
        gift.classList.add("shake-2");
        hint.textContent = "Almost there... tap again!";
    }

    if (tapCount === 3) {
        exploded = true;
        shakePower = 10;
        gift.classList.remove("shake-2");
        gift.classList.add("explode");
        hint.textContent = "";

        const rect = gift.getBoundingClientRect();
        burst = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        radius: 0,
        alpha: 0.9
      };

        setTimeout(() => {
            startConfetti();
            startPageTransition();
        }, 300);
    }

    //hapus biar ga ke loop
    setTimeout(() => {
        gift.classList.remove("shake-1", "shake-2");
    }, 400);
});

/* CONFETTI */
const confettiCanvas = document.getElementById("confetti");
const cctx = confettiCanvas.getContext("2d");

function resizeConfetti() {
  confettiCanvas.width = innerWidth;
  confettiCanvas.height = innerHeight;
}
resizeConfetti();
addEventListener("resize", resizeConfetti);

let confetti = [];
let burst = null;
let shakePower = 0;

function startConfetti() {
  const isMobile = innerWidth < 768;
createConfetti(isMobile ? 180 : 360); // mobile
  animateConfetti();
}

function startPageTransition() {
  setTimeout(() => {

    confetti.forEach(p => {
      p.gravity *= 0.5;
      p.vx *= 0.6;
      p.vy *= 0.6;
    });

    // ganti scene
    document.getElementById("prizeScene").classList.remove("active");
    document.getElementById("momentScene").classList.add("active");

  }, 1800);
}

function animateConfetti() {
  cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  if (shakePower > 0) {
    const dx = (Math.random() - 0.5) * shakePower;
    const dy = (Math.random() - 0.5) * shakePower;
    cctx.setTransform(1, 0, 0, 1, dx, dy);
    shakePower *= 0.85;
  } else {
    cctx.setTransform(1, 0, 0, 1, 0, 0);
  } 

  if (burst && burst.alpha > 0.7) {
  cctx.fillStyle = "rgba(255,255,255,0.35)";
  cctx.fillRect(0, 0, confettiCanvas.width, confettiCanvas.height);
}
  drawBurst();

    for (let i = confetti.length - 1; i >= 0; i--) {
        const p = confetti[i];

        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        if (p.rot !== undefined) p.rot += p.vr;
        
        drawConfetti(p);
        
       if ( p.y > confettiCanvas.height + 80 ||(p.life <= 0 && p.y > confettiCanvas.height * 0.75)) {
       confetti.splice(i, 1);
       }
}

  if (confetti.length > 0) {
    requestAnimationFrame(animateConfetti);
  }
}

function drawBurst() {
  if (!burst) return;

  burst.radius += 45;
  burst.alpha -= 0.08;

  const grad = cctx.createRadialGradient(
    burst.x, burst.y, 0,
    burst.x, burst.y, burst.radius * 0.6
  );

  grad.addColorStop(0, `rgba(255,255,255,${burst.alpha})`);
  grad.addColorStop(0.4, `rgba(255,255,255,${burst.alpha * 0.6})`);
  grad.addColorStop(1, "rgba(255,255,255,0)");

  cctx.fillStyle = grad;
  cctx.beginPath();
  cctx.arc(burst.x, burst.y, burst.radius * 0.6, 0, Math.PI * 2);
  cctx.fill();

  // SHOCKWAVE RING
  cctx.strokeStyle = `rgba(255,255,255,${burst.alpha * 0.7})`;
  cctx.lineWidth = 4;
  cctx.beginPath();
  cctx.arc(burst.x, burst.y, burst.radius, 0, Math.PI * 2);
  cctx.stroke();

  if (burst.alpha <= 0) {
    burst = null;
  }
}

function createConfetti(amount) {
  const rect = gift.getBoundingClientRect();
  const ox = rect.left + rect.width / 2
  const oy = rect.top + rect.height / 2

  const colors = [
    ["#ffe066","#fff1a8","#FFFFFF"], // gold
    ["#FFD78A","#CBB7FF","#F7EFFF"], //lavender
    ["#ff8fab", "#ffd6e8", "#FFFFFF"], // soft pink
    ["#c0c0c0", "#f5f5f5"], // silver
    ["#6ee7ff", "#bff4ff"], // blue foil
    ["#7cffb2", "#d9ffe9"], // mint
    ["#ffffff", "#fcfcfc"]  // white sparkle
  ];

for (let i = 0; i < amount; i++) {

  let metal = null;
  const r = Math.random();
  if (r < 0.25) metal = "gold";
  else if (r < 0.45) metal = "blue";

  if (Math.random() < 0.15) {
    confetti.push({
      x: ox,
      y: oy,
      vx: (Math.random() - 0.5) * 20,
      vy: Math.random() * -18,
      size: Math.random() * 5 + 3,
      color: ["#ffffff", "#ffffff"],
      shape: "circle",
      gravity: 0.2,
      life: 80
    });
    continue;
  }
    const color = colors[Math.floor(Math.random() * colors.length)];

    confetti.push ({
      x: ox,
      y: oy,
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -14 - 4,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 22 + 8,
      color,
      metal,
      shape:["rect", "circle", "ribbon", "heart", "rect", "circle"][Math.floor(Math.random()* 6)],
      gravity: 0.3 + Math.random() * 0.15
    });
  }
}

// confetti realistis
function drawConfetti(p) {
  cctx.save();
  cctx.translate(p.x, p.y);
  cctx.rotate(p.rot);

  const grad = cctx.createLinearGradient(0, 0, p.size, p.size);

  if (!p.metal) {
    grad.addColorStop(0, p.color[0]);
    grad.addColorStop(1, p.color[1]);
  }

  if (p.metal === "gold") {
    grad.addColorStop(0, "#FFD27D");
    grad.addColorStop(0.25, "#FFDE9E");
    grad.addColorStop(0.45, "#ffffff"); // highlight
    grad.addColorStop(0.75,"#FFECC4");
    grad.addColorStop(1,"#FFC85A");
  }
  cctx.shadowColor = "rgba(255,255,255,0.6)";
  cctx.shadowBlur = 8;
  if (p.metal === "blue") {
    grad.addColorStop(0, "#6fa8ff");
    grad.addColorStop(0.25,  "#8bbcff");
    grad.addColorStop(0.45, "#ffffff"); // highlight
    grad.addColorStop(0.75,  "#8bbcff");
    grad.addColorStop(1,"#6fa8ff");
  }

  cctx.fillStyle = grad;

  switch (p.shape) {
    case "circle":
      cctx.beginPath();
      cctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
      cctx.fill();
      break;

    case "ribbon":
      cctx.beginPath();
      cctx.moveTo(-p.size / 2, 0);
      cctx.lineTo(0, p.size / 2);
      cctx.lineTo(p.size / 2, 0);
      cctx.lineTo(0, -p.size / 2);
      cctx.closePath();
      cctx.fill();
      break;

    case "heart":
      cctx.beginPath();
      cctx.moveTo(0, p.size / 4);
      cctx.bezierCurveTo(
        p.size / 2, -p.size / 2,
        p.size, p.size / 3,
        0, p.size
      );
      cctx.bezierCurveTo(
        -p.size, p.size / 3,
        -p.size / 2, -p.size / 2,
        0, p.size / 4
      );
      cctx.fill();
      break;

    default:
      cctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
  }

  if (p.metal && Math.random() < 0.3) {
    cctx.globalCompositeOperation = "screen";
    cctx.fillStyle = "rgba(255,255,255,0.35)";
    cctx.fillRect(-p.size/2, -p.size/6, p.size, p.size/6);
    cctx.globalCompositeOperation = "source-over";
  }

  cctx.restore();
}

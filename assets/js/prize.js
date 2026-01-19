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
        gift.classList.remove("shake-2");
        gift.classList.add("explode");
        hint.textContent = "";

        setTimeout(() => {
            startConfetti();
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

function startConfetti() {
  const rect = gift.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  confetti = [];
  const colors = ["#ff6fae", "#ffd166", "#6ee7ff", "#b28dff", "#7CFFB2"];

  for (let i = 0; i < 1000; i++) {
    confetti.push({
      x: originX,
      y: originY,
      vx: (Math.random() - 0.5) * 14,
      vy: Math.random() * -14 - 6,
      size: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      gravity: 0.4,
      life: 100
    });
  }

  animateConfetti();
}

function animateConfetti() {
  cctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = confetti.length - 1; i >= 0; i--) {
        const p = confetti[i];

        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        cctx.fillStyle = p.color;
        cctx.fillRect(p.x, p.y, p.size, p.size);

        if (p.life <= 0) confetti.splice(i, 1);
}


  if (confetti.length > 0) {
    requestAnimationFrame(animateConfetti);
  }
}
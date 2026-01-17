
const scenes = [
  { text: "3", duration: 1000 },
  { text: "2", duration: 800 },
  { text: "1", duration: 800 },
  { text:"Happy Birthday Adel", duration: 1500 },
  { text:"08.02.07", duration: 1500, switchRain: true },
  { text:"Happy 19+", duration: 2000 },
];

let index = 0;
const textEl = document.getElementById("text");

/* canvas setup*/
const  canvas = document.getElementById("rain");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

/* rain setup*/
let rainChars = ["0", "1"];
const fontSize = 18;
let columns = Math.floor(canvas.width / fontSize);
let drops = Array(columns).fill(1);

function drawRain() {
  ctx.fillStyle = "rgba(0,0,0,0.07)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(225, 182, 193, 0.73)";
  ctx.font = fontSize + "px 'Share Tech Mono'";

  for (let i = 0; i < drops.length; i++) {
    const char = rainChars[Math.floor(Math.random()* rainChars.length)];
    ctx.fillText(char, i * fontSize, drops[i]* fontSize);

    if (drops[i]* fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i] += Math.random() * 1.0 + 0.3;
  }
}

setInterval(drawRain, 33);

/* scene controller */

function showScene() {
  const scene = scenes[index];

  textEl.textContent = scene.text;
  textEl.style.opacity = 1;

  if (scene.text === "3" || scene.text === "2" || scene.text === "1"){
    textEl.style.fontSize = "170px";
  }else {
    textEl.style.fontSize = "90px";
  }

  //switch biner ke huruf
  if (scene.switchRain) {
    rainChars = ["H", "A","P","P","Y","B","I","R","T","H","D","A","Y",]
  }

  setTimeout(() => {
    textEl.style.opacity = 0;
    index++;

    if (index < scenes.length) {
     setTimeout(showScene,600);//jeda antar text
    }
  }, scene.duration);
}

showScene();




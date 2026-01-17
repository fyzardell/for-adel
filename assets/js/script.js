
const texts = ["3","2","1","Happy Birthday Adel","08.02.07","Happy 19+"];

let index = 0;
const textEl = document.getElementById("text");

function showText() {
  textEl.textContent = texts[index];
  textEl.style.opacity = 1;

  setTimeout(() => {
    textEl.style.opacity = 0;
    index++;

    if (index < texts.length) {
     setTimeout(showText,600);//jeda antar text
    }
  },1200);//durasi text tampil
}

showText();

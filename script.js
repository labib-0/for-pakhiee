const intro = document.getElementById("intro");
const envelopeScreen = document.getElementById("envelopeScreen");
const wordsScreen = document.getElementById("wordsScreen");
const letterScreen = document.getElementById("letterScreen");
const startBtn = document.getElementById("startBtn");
const envelopeBtn = document.getElementById("envelopeBtn");
const envelopeWrap = document.getElementById("envelopeWrap");
const wordStage = document.getElementById("wordStage");
const letterImage = document.getElementById("letterImage");
const pageCount = document.getElementById("pageCount");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const musicBtn = document.getElementById("musicBtn");
const music = document.getElementById("music");

const pages = [
  "assets/letter-1.jpg",
  // Add more pages here:
  // "assets/letter-2.jpg",
  // "assets/letter-3.jpg",
];

let currentPage = 0;

function show(el) {
  el.classList.remove("hidden");
  el.setAttribute("aria-hidden", "false");
}

function hide(el) {
  el.classList.add("hidden");
  el.setAttribute("aria-hidden", "true");
}

startBtn.addEventListener("click", () => {
  hide(intro);
  show(envelopeScreen);
});

envelopeBtn.addEventListener("click", async () => {
  if (envelopeWrap.classList.contains("opening")) return;

  envelopeWrap.classList.add("opening");

  // Start the song immediately when she opens the envelope
  try {
    music.currentTime = 0;
    await music.play();
  } catch (error) {
    console.log("Music could not autoplay:", error);
  }

  setTimeout(() => {
    hide(envelopeScreen);
    show(wordsScreen);
    playWords();
  }, 1050);
});

function playWords() {
  const words = [
    ["rimmm", false],
    ["my pakhieee", false],
    ["Maya", true],
    ["my love", false],
    ["babieee", true],
    ["lovey", false],
    ["dovey", false]
  ];

  words.forEach(([text, small], i) => {
    setTimeout(() => {
      const el = document.createElement("div");
      el.className = "word" + (small ? " small" : "") + (i % 2 ? " fade" : "");
      el.textContent = text;
      el.style.setProperty("--duration", (1.75 + (i % 3) * .18) + "s");
      el.style.setProperty("--r1", ((i % 2 ? -1 : 1) * (1 + Math.random() * 2)) + "deg");
      el.style.setProperty("--r2", ((i % 2 ? 1 : -1) * (1 + Math.random() * 2)) + "deg");
      el.style.left = (47 + Math.random() * 6) + "%";
      wordStage.appendChild(el);

      setTimeout(() => el.remove(), 2100);
    }, i * 430);
  });

  setTimeout(() => {
    hide(wordsScreen);
    show(letterScreen);
    updatePageUI();
  }, 4100);
}

function updatePageUI() {
  letterImage.src = pages[currentPage];
  pageCount.textContent = `${currentPage + 1} / ${pages.length}`;
  prevBtn.disabled = currentPage === 0;
  nextBtn.disabled = currentPage === pages.length - 1;
}

function changePage(direction) {
  const nextPage = currentPage + direction;
  if (nextPage < 0 || nextPage >= pages.length) return;

  letterImage.classList.remove("page-in");
  letterImage.classList.add("page-out");

  setTimeout(() => {
    currentPage = nextPage;
    letterImage.src = pages[currentPage];
    updatePageUI();
    letterImage.classList.remove("page-out");
    void letterImage.offsetWidth;
    letterImage.classList.add("page-in");
  }, 420);
}

prevBtn.addEventListener("click", () => changePage(-1));
nextBtn.addEventListener("click", () => changePage(1));

let touchStartX = 0;
let touchStartY = 0;

letterScreen.addEventListener("touchstart", e => {
  touchStartX = e.changedTouches[0].clientX;
  touchStartY = e.changedTouches[0].clientY;
}, {passive: true});

letterScreen.addEventListener("touchend", e => {
  const x = e.changedTouches[0].clientX;
  const y = e.changedTouches[0].clientY;
  const dx = x - touchStartX;
  const dy = y - touchStartY;

  if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) {
    changePage(dx < 0 ? 1 : -1);
  }
}, {passive: true});

musicBtn.addEventListener("click", async () => {
  try {
    if (music.paused) {
      await music.play();
      musicBtn.textContent = "Ⅱ";
    } else {
      music.pause();
      musicBtn.textContent = "♪";
    }
  } catch (err) {
    musicBtn.textContent = "♪";
  }
});

updatePageUI();

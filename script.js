/**********************
  KIDS MATH QUIZ GAME
  FULL SCRIPT.JS
**********************/

const TOTAL_LEVELS = 100;

// 🔐 Saved data
let unlocked = localStorage.getItem("unlockedLevel")
  ? parseInt(localStorage.getItem("unlockedLevel"))
  : 1;

let character = localStorage.getItem("character") || "";
let currentLevel = 1;
let timer;
let timeLeft = 10;

// 🎵 Sounds
const correctSound = document.getElementById("correctSound");
const wrongSound = document.getElementById("wrongSound");

// 🧱 Screens & Elements
const levelScreen = document.getElementById("levelScreen");
const gameScreen = document.getElementById("gameScreen");
const levelsDiv = document.getElementById("levels");

const levelTitle = document.getElementById("levelTitle");
const questionEl = document.getElementById("question");
const optionsEl = document.getElementById("options");
const timerEl = document.getElementById("timer");
const starsEl = document.getElementById("stars");
const resultMsg = document.getElementById("resultMsg");
const leaderboardDiv = document.getElementById("leaderboard");
const dailyMsg = document.getElementById("dailyMsg");

/* =========================
   CHARACTER SELECT
========================= */
function selectCharacter(type) {
  character = type;
  localStorage.setItem("character", type);
  document.getElementById("characterSelect").style.display = "none";
}

if (character) {
  const cs = document.getElementById("characterSelect");
  if (cs) cs.style.display = "none";
}

/* =========================
   LEVEL SELECT SCREEN
========================= */
function loadLevels() {
  levelsDiv.innerHTML = "";
  for (let i = 1; i <= TOTAL_LEVELS; i++) {
    const btn = document.createElement("button");
    btn.innerText = i;
    btn.className = "level-btn " + (i <= unlocked ? "unlocked" : "locked");
    btn.disabled = i > unlocked;
    btn.onclick = () => startLevel(i);
    levelsDiv.appendChild(btn);
  }
  showLeaderboard();
  showTrophies();
}
loadLevels();

/* =========================
   START LEVEL
========================= */
function startLevel(level) {
  currentLevel = level;
  levelScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  generateQuestion();
}

/* =========================
   QUESTION GENERATOR
   Easy → Hard
========================= */
function generateQuestion() {
  clearInterval(timer);
  timeLeft = 10;
  starsEl.innerText = "⭐⭐⭐";
  timerEl.innerText = `⏱ ${timeLeft}`;
  resultMsg.innerText = "";
  levelTitle.innerText = `Level ${currentLevel}`;

  let a = currentLevel + 1;
  let b = currentLevel % 2 === 0 ? 1 : 0;
  let type = currentLevel % 4;

  let question, answer;

  if (type === 1) {
    question = `${a} + ${b}`;
    answer = a + b;
  } else if (type === 2) {
    question = `${a} - 1`;
    answer = a - 1;
  } else if (type === 3) {
    question = `2 × ${Math.floor(currentLevel / 2)}`;
    answer = 2 * Math.floor(currentLevel / 2);
  } else {
    question = `${a} ÷ 1`;
    answer = a;
  }

  questionEl.innerText = question;
  optionsEl.innerHTML = "";

  let options = [answer, answer + 1, answer - 1, answer + 2]
    .sort(() => Math.random() - 0.5);

  options.forEach(opt => {
    const btn = document.createElement("button");
    btn.innerText = opt;
    btn.onclick = () => checkAnswer(opt, answer);
    optionsEl.appendChild(btn);
  });

  startTimer();
}

/* =========================
   TIMER
========================= */
function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerEl.innerText = `⏱ ${timeLeft}`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      wrongSound.play();
      starsEl.innerText = "⭐";
      resultMsg.innerText = "❌ Time over!";
    }
  }, 1000);
}

/* =========================
   CHECK ANSWER
========================= */
function checkAnswer(selected, correct) {
  clearInterval(timer);
  resultMsg.innerText = "";

  if (selected === correct) {
    correctSound.play();

    // ⭐ Stars
    if (timeLeft > 7) starsEl.innerText = "⭐⭐⭐";
    else if (timeLeft > 4) starsEl.innerText = "⭐⭐";
    else starsEl.innerText = "⭐";

    // 🔓 Unlock next level
    if (currentLevel === unlocked) {
      unlocked++;
      localStorage.setItem("unlockedLevel", unlocked);
    }

    // 🏆 Leaderboard
    saveLeaderboard();

    // 📅 Daily challenge
    if (localStorage.getItem("dailyMode") === "yes") {
      dailyCompleted();
    }

    setTimeout(backToLevels, 1200);

  } else {
    wrongSound.play();
    starsEl.innerText = "⭐";
    resultMsg.innerText = "❌ Galat hai! Dobara try karo";
  }
}

/* =========================
   BACK TO LEVELS
========================= */
function backToLevels() {
  gameScreen.classList.add("hidden");
  levelScreen.classList.remove("hidden");
  loadLevels();
}

/* =========================
   LEADERBOARD
========================= */
function saveLeaderboard() {
  let best = localStorage.getItem("bestLevel") || 1;
  if (unlocked > best) {
    localStorage.setItem("bestLevel", unlocked);
  }
  showLeaderboard();
}

function showLeaderboard() {
  let best = localStorage.getItem("bestLevel") || 1;
  if (leaderboardDiv) {
    leaderboardDiv.innerText = `🥇 Best Progress: Level ${best}`;
  }
}

/* =========================
   DAILY CHALLENGE
========================= */
function startDaily() {
  let today = new Date().toDateString();
  let played = localStorage.getItem("dailyPlayed");

  if (played === today) {
    dailyMsg.innerText = "❌ Aaj ka daily challenge ho chuka hai!";
    return;
  }

  localStorage.setItem("dailyMode", "yes");
  startLevel(1);
}

function dailyCompleted() {
  let today = new Date().toDateString();
  localStorage.setItem("dailyPlayed", today);
  localStorage.removeItem("dailyMode");
  dailyMsg.innerText = "✅ Daily Challenge Complete!";
}

/* =========================
   TROPHIES / MEDALS
========================= */
function showTrophies() {
  const trophiesDiv = document.getElementById("trophies");
  if (!trophiesDiv) return;

  let text = "";
  if (unlocked >= 10) text += "🥉 ";
  if (unlocked >= 30) text += "🥈 ";
  if (unlocked >= 60) text += "🥇 ";
  if (unlocked >= 100) text += "🏆 ";

  trophiesDiv.innerText = text
    ? "Your Awards: " + text
    : "No Awards Yet";
}

/* =========================
   RESET GAME
========================= */
function resetGame() {
  if (confirm("⚠️ Kya aap poori game reset karna chahte ho?")) {
    localStorage.removeItem("unlockedLevel");
    localStorage.removeItem("character");
    localStorage.removeItem("bestLevel");
    localStorage.removeItem("dailyPlayed");
    localStorage.removeItem("dailyMode");
    alert("✅ Game reset ho gayi!");
    location.reload();
  }
}

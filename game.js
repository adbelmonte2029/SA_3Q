var UNTITLED_SALMON_ONLY =
  "https://raw.githubusercontent.com/rmbamba2029/sashimi/refs/heads/main/Untitled26_20260215214959.jpg";
var UNTITLED_SALMON_WASABI =
  "https://raw.githubusercontent.com/rmbamba2029/sashimi/refs/heads/main/Untitled26_20260216193752.jpg";
var UNTITLED_SALMON_FLAKES =
  "https://raw.githubusercontent.com/rmbamba2029/sashimi/refs/heads/main/Untitled26_20260216171747.jpg";
var UNTITLED_SALMON_ALL =
  "https://raw.githubusercontent.com/rmbamba2029/sashimi/refs/heads/main/Untitled26_20260216204211%20(1).jpg";

var YES_SALMON_ONLY =
  "https://raw.githubusercontent.com/rmbamba2029/sashimi/refs/heads/main/_yes%20salmon.jpg";
var YES_WASABI =
  "https://raw.githubusercontent.com/rmbamba2029/sashimi/refs/heads/main/yes%20wasabi.jpg";
var YES_FLAKES =
  "https://raw.githubusercontent.com/rmbamba2029/sashimi/refs/heads/main/yes%20flakes.jpg";
var YES_COMBO =
  "https://raw.githubusercontent.com/rmbamba2029/sashimi/refs/heads/main/yes%203combo%20.jpg";

var STEP_WASABI_SALMON =
  "https://raw.githubusercontent.com/rmbamba2029/sashimi/refs/heads/main/wasabi%20salmon.jpg";
var STEP_FLAKES_SALMON =
  "https://raw.githubusercontent.com/rmbamba2029/sashimi/refs/heads/main/flakes%20salmon.jpg";
var STEP_COMBO_SALMON =
  "https://raw.githubusercontent.com/rmbamba2029/sashimi/refs/heads/main/3combo%20salmon.jpg";
var STEP_COMBO_WASABI =
  "https://raw.githubusercontent.com/rmbamba2029/sashimi/refs/heads/main/3combo%20wasabi.jpg";
var STEP_COMBO_FLAKES =
  "https://raw.githubusercontent.com/rmbamba2029/sashimi/refs/heads/main/3combo%20flakes.jpg";

var WRONG_SAL_WAS =
  "https://raw.githubusercontent.com/rmbamba2029/sashimi/refs/heads/main/wrong%20s%20sal%2Bwas.jpg";
var WRONG_SAL_FLAKES =
  "https://raw.githubusercontent.com/rmbamba2029/sashimi/refs/heads/main/wrong%20s%20sal_fl.jpg";
var WRONG_SAL_COMBO =
  "https://raw.githubusercontent.com/rmbamba2029/sashimi/refs/heads/main/wrong%20s%20combo.jpg";

var WRONG_WAS_FLAKES =
  "https://raw.githubusercontent.com/rmbamba2029/sashimi/refs/heads/main/wrong%20w%20combo.jpg";
var WRONG_WAS_COMBO =
  "https://raw.githubusercontent.com/rmbamba2029/sashimi/refs/heads/main/wrong%20w%20sal%2Bfl.jpg";

var WRONG_FLAKES_WAS =
  "https://raw.githubusercontent.com/rmbamba2029/sashimi/refs/heads/main/wrong%20fl%20was.jpg";
var WRONG_FLAKES_COMBO =
  "https://raw.githubusercontent.com/rmbamba2029/sashimi/refs/heads/main/wrong%20fl%20combo.jpg";

var scoreText = document.getElementById("score");
var timerText = document.getElementById("timer");
var msg = document.getElementById("message");

var playBtn = document.getElementById("playBtn");
var overlay = document.getElementById("overlay");
var timesUp = document.getElementById("timesUp");
var replayBtn = document.getElementById("replayBtn");
var successOverlay = document.getElementById("successOverlay");

var boardImage = document.getElementById("boardImage");

var wasabiBtn = document.getElementById("wasabiBtn");
var salmonBtn = document.getElementById("salmonBtn");
var flakesBtn = document.getElementById("flakesBtn");

var serveBtn = document.getElementById("serveBtn");
var clearBtn = document.getElementById("clearBtn");
var pauseBtn = document.getElementById("pauseBtn");

var score = 0;
var timeLeft = 60;
var timerId = null;
var gameRunning = false;
var paused = false;

var orders = [
  {
    name: "salmon only",
    needSalmon: true,
    needWasabi: false,
    needFlakes: false,
    startBoard: UNTITLED_SALMON_ONLY,
    imagesByState: {
      "salmon-only": YES_SALMON_ONLY,
      "salmon-wasabi": WRONG_SAL_WAS,
      "salmon-flakes": WRONG_SAL_FLAKES,
      combo: WRONG_SAL_COMBO
    },
    yesBoard: YES_SALMON_ONLY
  },
  {
    name: "salmon + wasabi",
    needSalmon: true,
    needWasabi: true,
    needFlakes: false,
    startBoard: UNTITLED_SALMON_WASABI,
    imagesByState: {
      "salmon-only": STEP_WASABI_SALMON,
      "salmon-wasabi": YES_WASABI,
      "salmon-flakes": WRONG_WAS_FLAKES,
      combo: WRONG_WAS_COMBO
    },
    yesBoard: YES_WASABI
  },
  {
    name: "salmon + flakes",
    needSalmon: true,
    needWasabi: false,
    needFlakes: true,
    startBoard: UNTITLED_SALMON_FLAKES,
    imagesByState: {
      "salmon-only": STEP_FLAKES_SALMON,
      "salmon-wasabi": WRONG_FLAKES_WAS,
      "salmon-flakes": YES_FLAKES,
      combo: WRONG_FLAKES_COMBO
    },
    yesBoard: YES_FLAKES
  },
  {
    name: "salmon + wasabi + flakes",
    needSalmon: true,
    needWasabi: true,
    needFlakes: true,
    startBoard: UNTITLED_SALMON_ALL,
    imagesByState: {
      "salmon-only": STEP_COMBO_SALMON,
      "salmon-wasabi": STEP_COMBO_WASABI,
      "salmon-flakes": STEP_COMBO_FLAKES,
      combo: YES_COMBO
    },
    yesBoard: YES_COMBO
  }
];

orders.sort(function () {
  return Math.random() - 0.5;
});

var currentOrderIndex = 0;
var currentOrder = orders[currentOrderIndex];

var hasSalmon = false;
var hasWasabi = false;
var hasFlakes = false;

function updateScore() {
  scoreText.textContent = "Score: " + score;
}

function updateTimer() {
  timerText.textContent = "Time: " + timeLeft;
}

function setOrder(index) {
  currentOrderIndex = index;
  currentOrder = orders[index];
  boardImage.src = currentOrder.startBoard;
  hasSalmon = false;
  hasWasabi = false;
  hasFlakes = false;
  msg.textContent = "";
}

function startTimer() {
  timeLeft = 60;
  updateTimer();
  timerId = setInterval(function () {
    if (paused) return;

    timeLeft -= 1;

    if (timeLeft <= 0) {
      timeLeft = 0;
      updateTimer();
      clearInterval(timerId);
      gameRunning = false;
      timesUp.style.display = "flex";
    } else {
      updateTimer();
    }
  }, 1000);
}

function startGame() {
  timesUp.style.display = "none";
  successOverlay.style.display = "none";
  overlay.style.display = "none";

  score = 0;
  updateScore();
  paused = false;
  pauseBtn.textContent = "Pause";
  gameRunning = true;

  orders.sort(function () {
    return Math.random() - 0.5;
  });
  setOrder(0);
  startTimer();
}

function stateKey() {
  if (hasSalmon && !hasWasabi && !hasFlakes) return "salmon-only";
  if (hasSalmon && hasWasabi && !hasFlakes) return "salmon-wasabi";
  if (hasSalmon && !hasWasabi && hasFlakes) return "salmon-flakes";
  if (hasSalmon && hasWasabi && hasFlakes) return "combo";
  return "none";
}

function updateBoardFromState() {
  var key = stateKey();
  if (key === "none") {
    boardImage.src = currentOrder.startBoard;
    return;
  }
  var img = currentOrder.imagesByState[key];
  boardImage.src = img || currentOrder.startBoard;
}

playBtn.addEventListener("click", startGame);
replayBtn.addEventListener("click", startGame);

pauseBtn.addEventListener("click", function () {
  if (!gameRunning) return;
  paused = !paused;
  pauseBtn.textContent = paused ? "Resume" : "Pause";
});

clearBtn.addEventListener("click", function () {
  if (!gameRunning || paused) return;
  hasSalmon = false;
  hasWasabi = false;
  hasFlakes = false;
  boardImage.src = currentOrder.startBoard;
  msg.textContent = "";
});

salmonBtn.addEventListener("click", function () {
  if (!gameRunning || paused) return;
  hasSalmon = true;
  updateBoardFromState();
  msg.textContent = "";
});

wasabiBtn.addEventListener("click", function () {
  if (!gameRunning || paused) return;
  if (!hasSalmon) {
    msg.textContent = "Place salmon first.";
    return;
  }
  hasWasabi = true;
  updateBoardFromState();
  msg.textContent = "";
});

flakesBtn.addEventListener("click", function () {
  if (!gameRunning || paused) return;
  if (!hasSalmon) {
    msg.textContent = "Place salmon first.";
    return;
  }
  hasFlakes = true;
  updateBoardFromState();
  msg.textContent = "";
});

serveBtn.addEventListener("click", function () {
  if (!gameRunning || paused) return;

  if (!hasSalmon) {
    msg.textContent = "You must place salmon.";
    return;
  }

  var correct =
    hasSalmon === currentOrder.needSalmon &&
    hasWasabi === currentOrder.needWasabi &&
    hasFlakes === currentOrder.needFlakes;

  if (correct) {
    score += 1;
    updateScore();
    msg.textContent = "Correct!";
    boardImage.src = currentOrder.yesBoard;
    successOverlay.style.display = "block";

    var next = (currentOrderIndex + 1) % orders.length;

    setTimeout(function () {
      successOverlay.style.display = "none";
      setOrder(next);
    }, 600);
  } else {
    msg.textContent = "Wrong combo. Try again.";
  }
});

updateScore();
updateTimer();
setOrder(0);
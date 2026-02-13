let lives = 5;
let wins = 0;
let heartPosition = 0;
let canClick = false;
let isShuffling = false;

let cardWrappers;
let cards;

const livesContainer = document.getElementById("lives-container");
const winsDisplay = document.getElementById("wins");
const gameStatus = document.getElementById("game-status");
const retryButton = document.getElementById("retry-button");
const revealButton = document.getElementById("reveal-button");
const welcomeContainer = document.getElementById("welcome-container");
const gameContainer = document.getElementById("game-container");
const surpriseContainer = document.getElementById("surprise-container");
const welcomeStartButton = document.getElementById("welcome-start-button");
const surpriseImage = document.getElementById("surprise-image");
const downloadImageBtn = document.getElementById("download-image-btn");

const cardSymbols = [
  '<i class="ri-heart-fill text-red-500"></i>',
  '<i class="ri-close-line text-gray-400"></i>',
  '<i class="ri-close-line text-gray-400"></i>',
];

const positions = ["0%", "33.33%", "66.66%"];

let cardPositions = [0, 1, 2];

function updateLivesDisplay() {
  const hearts = livesContainer.querySelectorAll("i");
  hearts.forEach((heart, index) => {
    if (index < lives) {
      heart.className = "ri-heart-fill text-red-500 text-2xl";
    } else {
      heart.className = "ri-heart-fill text-gray-300 text-2xl";
    }
  });
}

function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function initRound() {
  canClick = false;
  isShuffling = false;

  cardWrappers = document.querySelectorAll(".card-wrapper");
  cards = document.querySelectorAll(".card");

  cardPositions = [0, 1, 2];

  cardWrappers.forEach((wrapper, index) => {
    wrapper.style.left = positions[index];
    wrapper.style.transition = "none";
    wrapper.dataset.position = index;
    wrapper.dataset.cardId = index;
  });

  const shuffledSymbols = shuffleArray(cardSymbols);
  heartPosition = shuffledSymbols.indexOf(cardSymbols[0]);

  cards.forEach((card, index) => {
    const content = card.querySelector(".card-content");
    content.innerHTML = shuffledSymbols[index];
    card.classList.remove("opacity-50");
    card.style.pointerEvents = "none";
    card.dataset.cardId = index;
  });

  gameStatus.querySelector("p").textContent =
    "Memoriza la posición del corazón...";

  setTimeout(() => {
    cards.forEach((card) => {
      const content = card.querySelector(".card-content");
      content.innerHTML = "";
    });
    gameStatus.querySelector("p").textContent =
      "Las tarjetas se están mezclando...";

    setTimeout(() => {
      shuffleCards();
    }, 300);
  }, 2500);
}

function shuffleCards() {
  isShuffling = true;
  let shuffleCount = 0;
  const maxShuffles = 8;

  const shuffleInterval = setInterval(() => {
    const newOrder = shuffleArray([0, 1, 2]);

    cardWrappers.forEach((wrapper) => {
      const cardId = parseInt(wrapper.dataset.cardId);
      const newPosition = newOrder.indexOf(cardId);

      cardPositions[cardId] = newPosition;

      wrapper.style.transition = "left 0.8s ease-in-out";
      wrapper.style.left = positions[newPosition];
      wrapper.dataset.position = newPosition;
    });

    shuffleCount++;

    if (shuffleCount >= maxShuffles) {
      clearInterval(shuffleInterval);

      setTimeout(() => {
        isShuffling = false;
        canClick = true;
        cards.forEach((card) => {
          card.style.pointerEvents = "auto";
        });
        gameStatus.querySelector("p").textContent = "¡Elige una tarjeta!";
      }, 900);
    }
  }, 1000);
}

function handleCardClick(e) {
  if (!canClick || isShuffling) return;

  const card = e.currentTarget;
  const wrapper = card.closest(".card-wrapper");
  const clickedCardId = parseInt(wrapper.dataset.cardId);

  canClick = false;
  cards.forEach((c) => (c.style.pointerEvents = "none"));

  const content = card.querySelector(".card-content");

  if (clickedCardId === heartPosition) {
    content.innerHTML = '<i class="ri-heart-fill text-red-500"></i>';
    wins++;
    winsDisplay.textContent = wins;
    gameStatus.querySelector("p").textContent = "¡Correcto! 🎉";

    if (wins === 5) {
      setTimeout(() => {
        gameStatus.querySelector("p").textContent = "¡Ganaste! 🎊";
        revealButton.classList.remove("hidden");
      }, 1500);
    } else {
      setTimeout(() => {
        initRound();
      }, 1500);
    }
  } else {
    content.innerHTML = '<i class="ri-close-line text-gray-400"></i>';
    lives--;
    updateLivesDisplay();
    gameStatus.querySelector("p").textContent = "¡Incorrecto! 😔";

    setTimeout(() => {
      cardWrappers.forEach((wrapper) => {
        const cardId = parseInt(wrapper.dataset.cardId);
        if (cardId === heartPosition) {
          wrapper.querySelector(".card-content").innerHTML =
            '<i class="ri-heart-fill text-red-500"></i>';
        }
      });
    }, 500);

    if (lives === 0) {
      setTimeout(() => {
        gameStatus.querySelector("p").textContent =
          "Perdiste todas las vidas 😢";
        retryButton.classList.remove("hidden");
        cards.forEach((c) => c.classList.add("opacity-50"));
      }, 2000);
    } else {
      setTimeout(() => {
        initRound();
      }, 2000);
    }
  }
}

function startGame() {
  lives = 5;
  wins = 0;
  updateLivesDisplay();
  winsDisplay.textContent = wins;
  retryButton.classList.add("hidden");
  revealButton.classList.add("hidden");
  welcomeContainer.classList.add("hidden");
  gameContainer.classList.remove("hidden");

  setTimeout(() => {
    initRound();
  }, 100);
}

function revealSurprise() {
  gameContainer.classList.add("hidden");
  surpriseContainer.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function setupCardListeners() {
  const allCards = document.querySelectorAll(".card");
  allCards.forEach((card) => {
    card.addEventListener("click", handleCardClick);
  });
}

setupCardListeners();

welcomeStartButton.addEventListener("click", startGame);
retryButton.addEventListener("click", startGame);
revealButton.addEventListener("click", revealSurprise);

surpriseImage.addEventListener("click", () => {
  window.open(surpriseImage.src, "_blank");
});

downloadImageBtn.addEventListener("click", () => {
  const link = document.createElement("a");
  link.href = surpriseImage.src;
  link.download = "regalo.jpg";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
});

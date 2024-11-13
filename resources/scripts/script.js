const main = document.querySelector("main");
const instruments = document.querySelectorAll(".instrument");
const playButton = document.querySelector(".play");
const submitButton = document.querySelector(".submit");
const levelUpButton = document.querySelector(".level-up");
const guessesList = document.getElementById("guesses");
const message = document.querySelector(".message");

const sounds = [
  new Audio("/resources/sounds/guitar.mp3"),
  new Audio("/resources/sounds/drum.mp3"),
  new Audio("/resources/sounds/piano.mp3"),
  new Audio("/resources/sounds/saxophone.mp3"),
  new Audio("/resources/sounds/violin.mp3"),
  new Audio("/resources/sounds/recorder.mp3"),
];
let currLevel = 0;
let currSelectedGuess = null;
let answer = [];

//utility functions (start)
const generateGuessList = () => {
  //clear previous level's list
  guessesList.textContent = "";

  //generate guess list items and add event listeners
  for (let i = 0; i < currLevel + 4; i++) {
    const guess = document.createElement("li");
    guess.classList.add("guess");
    guess.dataset.id = i;
    guess.addEventListener("click", (el) => {
      el.stopPropagation();
      clearSelectedGuess();
      el.target.closest("li").classList.add("selected");
      instruments.forEach((instrument) =>
        instrument.classList.add("highlighted")
      );
      currSelectedGuess = el.target.closest("li").dataset.id;
    });
    guessesList.appendChild(guess);
  }
  currLevel++;
};

const getSelectedGuess = () =>
  [...document.querySelectorAll(".guess")].filter(
    (guess) => guess.dataset.id === currSelectedGuess
  )[0];

const clearSelectedGuess = () => {
  if (currSelectedGuess !== null) {
    getSelectedGuess().classList.remove("selected");
    currSelectedGuess = null;
  }
};

const clearHighlightedInstruments = () =>
  instruments.forEach((instrument) =>
    instrument.classList.remove("highlighted")
  );

const toggleHiddenButton = (toHide, toShow) => {
  toHide.classList.add("hidden");
  toShow.classList.remove("hidden");
};

const generateAnswer = () => {
  for (let i = 0; i < currLevel + 3; i++) {
    answer.push(Math.floor(Math.random() * instruments.length));
  }
  console.log(answer);
};

const checkAnswer = () => {
  const guesses = document.querySelectorAll(".guess");
  let correctCount = 0;

  guesses.forEach((guess, index) => {
    if (Number(guess.dataset.instrumentId) === answer[index]) {
      correctCount += 1;
    }
  });

  if (correctCount === currLevel + 3) {
    message.textContent = "Nice job! That's correct 🎉";
    answer = [];
    toggleHiddenButton(submitButton, levelUpButton);
  } else {
    message.textContent = "Sorry. That's incorrect 😢";
  }
};
//utility functions (end)

generateGuessList();
generateAnswer();

//clear all selected and highlighted elements when main is clicked
main.addEventListener("click", (el) => {
  el.stopPropagation();
  clearSelectedGuess();
  clearHighlightedInstruments();
  currSelectedGuess = null;
});

//add event listeners to instrument list items
for (let i = 0; i < instruments.length; i++) {
  instruments[i].addEventListener("click", (el) => {
    el.stopPropagation();
    if (currSelectedGuess === null) {
      sounds[i].play();
    } else {
      getSelectedGuess().innerHTML = `<img src="resources/images/${
        el.target.closest("li").dataset.instrument
      }.png" alt="${el.target.closest("li").dataset.description} icon" />`;
      getSelectedGuess().dataset.instrumentId =
        el.target.closest("li").dataset.id;
      clearSelectedGuess();
      clearHighlightedInstruments();
    }
  });
}

playButton.addEventListener("click", (el) => {
  el.stopPropagation();
  let soundDelay = 0;

  for (let i = 0; i < answer.length; i++) {
    console.log(soundDelay);
    setTimeout(() => sounds[answer[i]].play(), soundDelay);
    soundDelay += sounds[answer[i]].duration * 1000 + 100;
  }

  toggleHiddenButton(playButton, submitButton);
});

levelUpButton.addEventListener("click", (el) => {
  el.stopPropagation();
  generateGuessList();
  generateAnswer();
  message.textContent = "Please input your guess.";
  toggleHiddenButton(levelUpButton, playButton);
});

submitButton.addEventListener("click", (el) => {
  el.stopPropagation();
  if ([...document.querySelectorAll(".guess img")].length === currLevel + 3) {
    checkAnswer();
  } else {
    message.textContent = "Please complete your guess.";
  }
});

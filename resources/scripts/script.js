const main = document.querySelector("main");
const instruments = document.querySelectorAll(".instrument");
const submitButton = document.querySelector(".submit");
const playButton = document.querySelector(".play");
const guessesList = document.getElementById("guesses");

let currLevel = 0;
let currSelectedGuess = null;

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

const toggleHiddenButton = () => {
  submitButton.classList.toggle("hidden");
  playButton.classList.toggle("hidden");
};
//utility functions (end)

generateGuessList();

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
      console.log(`Playing the: ${el.target.closest("li").dataset.instrument}`);
    } else {
      getSelectedGuess().innerHTML = `<img src="resources/images/${
        el.target.closest("li").dataset.instrument
      }.png" alt="${el.target.closest("li").dataset.description} icon" />`;
      clearSelectedGuess();
      clearHighlightedInstruments();
    }
  });
}

playButton.addEventListener("click", (el) => {
  el.stopPropagation();
  generateGuessList();
  toggleHiddenButton();
});

submitButton.addEventListener("click", (el) => {
  el.stopPropagation();
  if ([...document.querySelectorAll(".guess img")].length === currLevel + 3) {
    console.log("Checking answer...");
    toggleHiddenButton();
  } else {
    console.log("Please complete your guess");
  }
});

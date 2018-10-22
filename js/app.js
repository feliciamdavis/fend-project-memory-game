/*
 * Create a list that holds all of your cards
 */
const cardClasses = [
    "fas fa-ghost",
    "fas fa-ghost",
    "fas fa-spider",
    "fas fa-spider",
    "fas fa-hat-wizard",
    "fas fa-hat-wizard",
    "fas fa-cat",
    "fas fa-cat",
    "fas fa-broom",
    "fas fa-broom",
    "fas fa-book-dead",
    "fas fa-book-dead",
    "fas fa-mask",
    "fas fa-mask",
    "fas fa-crow",
    "fas fa-crow"
]

const deckElement = document.querySelector(".deck");
const starsElement = document.querySelector(".stars");
const timeElement = document.querySelector(".time");

let matches;
let moves;
let firstCardElement;
let secondCardElement;
let starCount;
let startTime;
let elapsedSeconds;

function forgetCards() {
    firstCardElement = undefined;
    secondCardElement = undefined;
}

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function setupGame() {
    shuffle(cardClasses);

    let cards = ""
    for (const cardClass of cardClasses) {

        const card = `
            <li class="card">
                <i class="${cardClass}"></i>
            </li>
        `
        cards += card;
    }
    deckElement.innerHTML = cards;
}

function resetGame() {
    matches = 0;
    moves = 0;
    starCount = 5;
    forgetCards();
    setupGame();
    updateMoveCounter();
    updateVisableStars();
    startTime = undefined;
}

resetGame();

function updateVisableStars() {
    let stars = "";
    for (starNum = 0; starNum < starCount; starNum++) {
        const star = `
        <li>
            <i class="fa fa-star"></i>
        </li>
    `
        stars += star;
    }
    starsElement.innerHTML = stars;
}

function updateTimer() {
    if (startTime === undefined) {
        timeElement.innerText = 0;
    }
    else {
        const now = Date.now();
        const elapsedTime = now - startTime;
        elapsedSeconds = Math.round(elapsedTime / 1000);
        timeElement.innerText = elapsedSeconds;
    }
}

setInterval(updateTimer,1000);

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
function updateMoveCounter() {
    const movesElement = document.querySelector(".moves");
    movesElement.innerText = moves;
}

function incrementMoveCounter() {
    moves += 1
    updateMoveCounter();
}

function decrementStars() {
    starCount -= 1
    if(starCount < 1) {
        starCount = 1;
    }
    updateVisableStars();
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/**
 * Shows a card.
 * @param {HTMLElement} cardElement The card to show.
 */
function showCard(cardElement) {
    cardElement.classList.add("show");
}

/**
 * Opens a card (WAT!? 😡 IT SELECTS, NOT OPENS).
 * @param {HTMLElement} cardElement The card to open.
 */
function openCard(cardElement) {
    cardElement.classList.add("open");
}

/**
 * They made a match
 * @param {HTMLElement} cardElement
 */
function matchedCard(cardElement) {
    cardElement.classList.add("match");
}

/**
 * No match
 * @param {HTMLElement} cardElement
 */
function resetCard(cardElement) {
    cardElement.classList.remove("show");
    cardElement.classList.remove("open");
}

function onClick(event) {
    const cardElement = event.target;
    if (cardElement.className === "card") {
        onCardClicked(cardElement);
    }
}

deckElement.addEventListener("click", onClick);

function onCardClicked(cardElement) {
    if (firstCardElement === undefined) {
        if(startTime === undefined) {
            startTime = Date.now();
        }
        firstCardElement = cardElement;
        showCard(cardElement);
        openCard(cardElement);
    }
    else if (secondCardElement === undefined) {
        secondCardElement = cardElement;
        showCard(cardElement);
        openCard(cardElement);
        const firstCardIconElement = firstCardElement.querySelector("i");
        const firstCardClass = firstCardIconElement.className;
        const secondCardIconElement = secondCardElement.querySelector("i");
        const secondCardClass = secondCardIconElement.className;
        incrementMoveCounter();
        if (firstCardClass === secondCardClass) {
            matches += 1;
            matchedCard(firstCardElement);
            matchedCard(secondCardElement);
            forgetCards();
            if(matches === 8){
                setTimeout(showWinnerAlert, 1000);
            }
        }
        else {
            setTimeout(function () {
                resetCard(firstCardElement);
                resetCard(secondCardElement);
                forgetCards();
                decrementStars();
            }, 2000);
        }
    }
}

function showWinnerAlert() {
    alert(`Congratulations, you win!
    ${starCount} Stars
    ${elapsedSeconds} Seconds`
    )
    resetGame();
}


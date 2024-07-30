// Game Name
let gameName = "Guess The Word";
document.title = gameName;
document.querySelector("h1").innerHTML = gameName;
document.querySelector("footer").innerHTML = `${gameName} Game Created By Code Art`;

// Game Options
let numOfTries = 10;
let numOfLetters = 6;
let currentTry = 1;
let numOfHints = 2;

// Manage Words
let wordToGuess = "";
const words = ["Create", "Update", "Delete", "School", "Master", "Mainly", "Branch", "Casual", "Couple", "Cactus", "Domain", "Carbon"];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
console.log(wordToGuess);

// Manage Hints
document.querySelector(".hint span").innerHTML = numOfHints;
const getHintBtn = document.querySelector(".hint");
getHintBtn.addEventListener("click", getHint);

let messageArea = document.querySelector(".message");

function generateInput() {
    const InputContainer = document.querySelector(".inputs");

    // Create Try Divs
    for(let i = 1; i <= numOfTries; i++) {
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Try ${i}</span>`;

        if(i !== 1) tryDiv.classList.add("disabled-inputs");

        // Create Letter Inputs 
        for(let j = 1; j <= numOfLetters; j++) {
            const input = document.createElement("input");
            input.type = "text";
            input.id = `guess-${i}-letter-${j}`;
            input.setAttribute("maxlength", "1");
            tryDiv.appendChild(input);
        }

        InputContainer.appendChild(tryDiv);
    }

    // Focus On First Input In First Try Element
    InputContainer.children[0].children[1].focus();

    // Disable All Inputs Exept The First
    const disabledDiv = document.querySelectorAll(".disabled-inputs input");
    disabledDiv.forEach((input) => (input.disabled = true));

    
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input, index) => {
        // Convert Letters To Upper Case
        input.addEventListener("input", function () {
            this.value = this.value.toUpperCase();

            const nextInput = inputs[index + 1];
            if (nextInput) nextInput.focus();
        });
        // Set Game Control
        input.addEventListener("keydown", function (event) {
            const currentIndex = Array.from(inputs).indexOf(event.target);
            if (event.key === "ArrowRight") {
                const nextInputArea = currentIndex + 1;
                if (nextInputArea < inputs.length) {
                    inputs[nextInputArea].focus();
                }
            }
            if (event.key === "ArrowLeft") {
                const prevInputArea = currentIndex - 1;
                if (prevInputArea >= 0) {
                    inputs[prevInputArea].focus();
                }
            }
        });
    });
}

// Handle Word
const checkBtn = document.querySelector(".check");
checkBtn.addEventListener("click", handleGuesses);

function handleGuesses () {
    let successGuess = true;
    console.log(wordToGuess);
    for (let i = 1; i <= numOfLetters; i++) {
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const letter = inputField.value.toLowerCase();
        const actualLetter = wordToGuess[i - 1];

        // Game Logic
        // Letter Is Correct And In Place
        if (letter === actualLetter) {
            inputField.classList.add("yes-in-place");
        }
        // Letter Is correct But Not In Place
        else if (wordToGuess.includes(letter) && letter !== "") {
            inputField.classList.add("not-in-place");
            successGuess = false;
        }
        // Letter Is Incorrect
        else {
            inputField.classList.add("no");
            successGuess = false;
        }
    }

    // Check If User Win Or Lose
    if (successGuess === true) {
        messageArea.innerHTML = `You Win, The Word Is <span>${wordToGuess}</span>`;
        if (numOfHints === 2) {
            messageArea.innerHTML = `<p>Congrats! You Didn't Use Hints</p>`;
        }

        // Disable All Inputs
        let allTries = document.querySelectorAll(".inputs > div");
        allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));

        // Disable Control Buttons
        checkBtn.disabled = true;
        getHintBtn.disabled = true;
    }
    else {
        // Disable The Current Inputs
        document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");
        const currentTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        currentTryInputs.forEach((input) => (input.disabled = true));

        // Select The Next Try Div
        currentTry++;

        // Enable The Next Inputs
        const nextTryInputs = document.querySelectorAll(`.try-${currentTry} input`);
        nextTryInputs.forEach((input) => (input.disabled = false));
        

        let element = document.querySelector(`.try-${currentTry}`);
        if (element) {
            document.querySelector(`.try-${currentTry}`).classList.remove("disabled-inputs");
            element.children[1].focus();
        }
        else {
            messageArea.innerHTML = `You Lose, The Word Is <span>${wordToGuess}</span>`;
            checkBtn.disabled = true;
        }
    }
}

// Get Hints
function getHint() {
    if (numOfHints > 0) {
        numOfHints--;
        document.querySelector(".hint span").innerHTML = numOfHints;
    }
    if (numOfHints === 0) {
        getHintBtn.disabled = true;
    }
    const enableInputs = document.querySelectorAll("input:not([disabled])");
    const emtpyEnableInputs = Array.from(enableInputs).filter((input) => input.value === "");
    
    if (emtpyEnableInputs.length > 0) {
        const randomIndex = Math.floor(Math.random() * emtpyEnableInputs.length);
        const randomInput = emtpyEnableInputs[randomIndex];
        const indexToFill = Array.from(enableInputs).indexOf(randomInput);
        
        if (indexToFill !== -1) {
            randomInput.value = wordToGuess[indexToFill].toUpperCase();
        }
        
    }
}

// Delete Letters
function handleBackspace(event) {
    if (event.key === "Backspace") {
        const inputs = document.querySelectorAll("input:not([disabled])");
        const currentIndex = Array.from(inputs).indexOf(document.activeElement);

        if (currentIndex > 0) {
            const currentInput = inputs[currentIndex];
            const prevInput = inputs[currentIndex - 1];

            currentInput.value = "";
            prevInput.value = "";
            prevInput.focus();
        }
    }
}

document.addEventListener("keydown", handleBackspace)

window.onload = function() {
    generateInput();
};
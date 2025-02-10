const backgroundMusic = new Audio("sounds/background_music.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.05;

function startBackgroundMusic() {
    backgroundMusic.play().catch(error => console.log("Autoplay blocked:", error));
}


export function playCorrectSound() {
    const correctSound = new Audio("sounds/correct.mp3");
    correctSound.volume = 1;
    correctSound.play().then(r => console.log("Correct sound played"));
}

export function playIncorrectSound() {
    const incorrectSound = new Audio("sounds/incorrect.mp3");
    incorrectSound.volume = 1;
    incorrectSound.play().then(r => console.log("Incorrect sound played"));
}

document.addEventListener("click", startBackgroundMusic, { once: true });
document.addEventListener("keydown", startBackgroundMusic, { once: true });

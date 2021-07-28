class AudioController{
    constructor(){
        this.bgMusic = new Audio('../Assets/Audio/infantilinstrumental.mp3');
        this.flipSound = new Audio('../Assets/Audio/flip.wav');
        this.matchSound = new Audio('../Assets/Audio/match.wav');
        this.victorySound = new Audio('../Assets/Audio/victory.wav');
        this.gameOverSoud = new Audio('../Assets/Audio/gameOver.wav');
        this.bgMusic.volume = 0.5;
        this.bgMusic.loop = true;
    }
    startMusic(){
        this.bgMusic.play();
    }

    stopMusic(){
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }

    flip(){
        this.flipSound.play();
    }

    match(){
        this.matchSound.play();
    }

    victory(){
        this.stopMusic();
        this.victorySound.play();
    }

    gameOver(){
        this.stopMusic();
        this.gameOverSoud.play();
    }
}

class JuegoMemoria{
    constructor(totalTime, cards){
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('tiempo-restante');
        this.ticker = document.getElementById('giros');
        this.audioController = new AudioController();
    }

    startGame(){
        this.cardToCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCards = [];
        this.busy = true;

        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffleCards();
            this.countDown = this.startCountDown();
            this.busy = false;
        }, 500);

        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
    }

    hideCards(){
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        });
    }

    flipCard(card){
        if(this.canFlipCard(card)){
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            //EEmparejar
            if (this.cardToCheck) {
                this.checkForCard(card);
            }else{
                this.cardToCheck = card;
            }
        }
    }

    checkForCard(card){
        if (this.getCardType(card) === this.getCardType(this.cardToCheck)) { 
            this.cardMatch(card);
        }else{
            this.cardMisMatch(card, this.cardToCheck);
        }
        this.cardToCheck = null;
    }

    cardMatch(card1, card2){
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        this.audioController.match();
        if(this.matchedCards.length === this.cardsArray.length){
            this.victory();
        }
    }

    cardMisMatch(card1, card2){
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 1000);
    }

    getCardType(card){
        return card.getElementsByClassName('card-value')[0].src;
    }

    startCountDown(){
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if(this.timeRemaining === 0){
                this.gameOver();
            }
        }, 1000);
    }

    gameOver(){
        clearInterval(this.countDown);
        this.audioController.gameOver();
        document.getElementById('juego-terminado-texto').classList.add('visible');
    }

    restart(){
        clearInterval(this.countDown);
    }

    victory(){
        clearInterval(this.countDown);
        this.audioController.victory();
        document.getElementById('victoria-texto').classList.add('visible');
    }

    shuffleCards(){
        //Algoritmo shuffle
        for(let i = this.cardsArray.length -1; i > 0; i--){
            let randIndex = Math.floor(Math.random() * (i+1));
            this.cardsArray[randIndex].style.order = i;
            this.cardsArray[i].style.order = randIndex;
        }
    }

    canFlipCard(card){
        
        return (!this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck);
    }
}


function ready(){
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new JuegoMemoria(100, cards);

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible');
            
            let audioController = new AudioController();
            audioController.flip();

            game.startGame();
            //audioController.flip();
            //audioController.startMusic();
        });
    });

    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);

        });
    });
}



if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready());
}else{
    ready();
}


function lvl1() {
    window.location = ("Niveles/level1.html");   
}

function lvl2() {
    window.location = ("Niveles/level2.html");
}

function lvl3() {
    window.location = ("Niveles/level3.html");
}

function lvlJuego() {

    window.location = ("../JuegoMemoria.html");
    
}

AOS.init();
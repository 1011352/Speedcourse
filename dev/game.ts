const plopSound = new Audio('./sound/plop.mp3')
const pauseButton = document.querySelector("pause")! as HTMLElement
const bg = document.querySelector('background')! as HTMLElement
let fishes : HTMLElement[] = []
let bubbles : HTMLElement[] = []

let paused = false
let bgpos = 0
let frame = 0 
let animFrames = 3
let framWidth = 130
let fishFPS = 0 

function createFishAndBubble(){
    for(let i = 0;i<4;i++){
        createFish()
        createBubble()
    }
    pauseButton.addEventListener("click", () => pauseGame())

    gameLoop()
}

function gameLoop(){
    for(let fish of fishes) {
        let position = fish.getBoundingClientRect()
        let newXposition = position.left - 1
        if (newXposition < 0 - position.width) {
            newXposition = window.innerWidth
        }
        let newYposition = position.top + Math.sin(newXposition/15)
        fish.style.transform = `translate(${newXposition}px, ${newYposition}px)`
        // spritesheet
        fishFPS++
        if(fishFPS % 30 == 0) {
            frame++
        }
        if(frame>animFrames){
            frame = 0 
        }
        let pos = 0 -(frame * framWidth)
        fish.style.backgroundPosition = `${pos}px 0px`
    }
    for (let bubble of bubbles) {
        let position = bubble.getBoundingClientRect()
        let newposition = position.top - 2
        if (newposition < 0 - position.height) {
            newposition = window.innerHeight
        }
        bubble.style.transform = `translate(${position.left}px, ${newposition}px)`
    }


// bg scroll
    bgpos--
    bg.style.backgroundPosition = `${bgpos}px 0px`

    if(!paused){
        requestAnimationFrame(()=>gameLoop())
    }
}

function createFish(){
    let fish = document.createElement("fish")
    document.body.appendChild(fish)
    let startx = (Math.random() * window.innerWidth)
    let starty = (Math.random() * window.innerHeight)
    let color = Math.random() * 300 + 30
    let rng = Math.floor(Math.random() * 4)
    if(rng == 0) {
        color = 0
        fish.dataset.color = "blue"
    }
    fishes.push(fish)
    fish.style.transform = `translate(${startx}px, ${starty}px)`
    fish.style.filter = `hue-rotate(${color}deg)`
    fish.addEventListener("click", (e)=>killFish(e))
}

function createBubble(){
    let bubble = document.createElement("bubble")
    document.body.appendChild(bubble)
    let startx = (Math.random() * window.innerWidth)
    let starty = (Math.random() * window.innerHeight)
    bubble.style.transform = `translate(${startx}px, ${starty}px)`
    bubbles.push(bubble)
    bubble.addEventListener("click", (e)=>popBubble(e))
}

function killFish(e:Event){
    let fish = e.target as HTMLElement
    fish.classList.add("dead")
    fishes = fishes.filter(f => f != fish)
}

function popBubble(e:Event) {
    let bubble = e.target as HTMLElement
    bubble.remove()
    bubbles = bubbles.filter(b => b != bubble)
    plopSound.play()
}

function pauseGame() {
    paused = !paused
    if(!paused) {
        pauseButton.innerText = "pause"
        gameLoop()
    } else {
        pauseButton.innerText = "Resume Game"
    }
}

createFishAndBubble()
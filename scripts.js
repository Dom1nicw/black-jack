const suits = ['Clubs', 'Diamonds', 'Hearts', 'Spades']
const cardnames = ['Ace', 'two', 'three', 'four', 'five', 'six', 'seven',
    'eight', 'nine', 'ten', 'Jack', 'Queen', 'King']
let fullDeck = []
let playerHand = []
let computerHand = []
let playerScore = 0
let computerScore = 0
let dealCounter = 0

function makeDeck(array) {
    for (i = 0; i < suits.length; i++) {
        for (j = 0; j < cardnames.length; j++) {
            let value = 0
            if (j < 10) {
                value = j + 1
            } else {
                value = 10
            }
            let name = cardnames[j] + ' of ' + suits[i]
            let card = {cardName: name, cardScore: value}
            array.push(card)
        }
    }
}

function shuffle(array) {
    array.sort(() => 0.5 - Math.random());
}

function dealCard(array) {
    array.push(fullDeck[0])
    fullDeck = fullDeck.slice(1)
}

function calcScore(array) {
    let score = 0
    array.forEach(function (card) {
        score = score + card.cardScore
    })
    if (numberOfAces(array) === 0) {
        return score
    } else if (numberOfAces(array) > 0 && score < 12) {
        return score + 10
    } else if (numberOfAces(array) > 0 && score > 11) {
        return score
    }
}

const startButton = document.querySelector('.startgame')
const restartButton = document.querySelector('.restartgame')
const dealButton = document.querySelector('.dealcards')
const startText = document.querySelector('.starttext')
const dealtText = document.querySelector('.dealttext')
const stickOrTwistText = document.querySelector('.stickortwisttext')
const stickButton = document.querySelector('.stickbutton')
const twistButton = document.querySelector('.twistbutton')
const stickOrTwistSection = document.querySelector('.sticktwistsection')
const computerPlaysText = document.querySelector('.computerplays')
const resultsText = document.querySelector('.results')
const aceButton = document.querySelector('.aceValue')

startButton.addEventListener('click', function() {
    startButton.classList.add('hidden')
    startText.classList.remove('hidden')
    restartButton.classList.remove('hidden')
    dealButton.classList.remove('hidden')
    makeDeck(fullDeck)
    shuffle(fullDeck)
    dealButton.addEventListener('click', dealTheCards)
    stickButton.addEventListener('click', playerSticks)
    twistButton.addEventListener('click', playerTwists)
})

restartButton.addEventListener('click', function() {
    fullDeck = []
    // set player hand to this when working on aces
    // playerHand = [{cardName: 'Ace of Spades', cardScore: 1}]
    playerHand = []
    computerHand = []
    playerScore = 0
    computerScore = 0
    dealCounter = 0
    document.querySelectorAll('.restartable').forEach(function (restartable){
        restartable.classList.add('hidden')
    })
    restartButton.classList.add('hidden')
    startButton.classList.remove('hidden')
    stickOrTwistText.innerHTML = ''
    dealtText.innerHTML = 'You are dealt the '
    computerPlaysText.innerHTML = ''
    resultsText.innerHTML = ''
})

function dealTheCards(e) {
    dealCard(playerHand)
    dealCard(computerHand)
    dealCard(playerHand)
    dealCard(computerHand)
    // console.log(playerHand)
    playerScore = calcScore(playerHand)
    computerScore = calcScore(computerHand)
    stickOrTwistSection.classList.remove('hidden')
    dealtText.innerHTML += playerHand[0].cardName + ' and the ' + playerHand[1].cardName
        + '. Your score is ' + playerScore + '.'
    dealtText.classList.remove('hidden')
    dealCounter++
    // console.log(dealCounter)
    dealButton.removeEventListener('click', dealTheCards)
    // numberOfAces(playerHand)
}

function playerSticks(e) {
    stickOrTwistText.innerHTML += '<p>You have stuck with ' + playerScore + '.</p>'
    stickButton.removeEventListener('click', playerSticks)
    twistButton.removeEventListener('click', playerTwists)
    computerPlaying()
}

function numberOfAces (cards) {
    let k = 0
    cards.forEach(function(card){
        if (card.cardName.includes('Ace')) {
            k++
        }
    })
    return k
}


function playerTwists(e) {
    dealCard(playerHand)
    let x = playerHand.length - 1
    playerScore = calcScore(playerHand)
    stickOrTwistText.innerHTML += '<p>You twist and get the ' + playerHand[x].cardName
        + '. Your score is now ' + playerScore + '.</p>'
    if (playerScore > 21) {
        twistButton.removeEventListener('click', playerTwists)
        stickButton.removeEventListener('click', playerSticks)
        stickOrTwistText.innerHTML += '<p>You have gone bust.</p>'
        computerPlaying()
    }
}

function computerSticks() {
    computerScore = calcScore(computerHand)
    computerPlaysText.innerHTML += '<p>The browser sticks with ' + computerScore + '.</p>'
}

function computerTwists() {
    dealCard(computerHand)
    let z = computerHand.length - 1
    computerScore = calcScore(computerHand)
    computerPlaysText.innerHTML += '<p>The browser twists and gets the ' + computerHand[z].cardName
        + '. Their score is now ' + computerScore +'.</p>'
}

function displayResults() {
    if (playerScore > 21 && computerScore > 21) {
        resultsText.innerHTML += '<p>You have both gone bust. Draw</p>'
    } else if (playerScore < 22 && computerScore > 21) {
        resultsText.innerHTML += '<p>You win!</p>'
    } else if (playerScore > 21 && computerScore < 22) {
        resultsText.innerHTML += '<p>Browser wins!</p>'
    } else if (playerScore === computerScore) {
        resultsText.innerHTML += '<p>Scores are equal. Draw</p>'
    } else if (playerScore > computerScore) {
        resultsText.innerHTML += '<p>You win!</p>'
    } else if (playerScore < computerScore) {
        resultsText.innerHTML += '<p>Browser wins!</p>'
    }
}

function computerPlaying() {
    computerPlaysText.innerHTML += '<p>The browser was dealt the ' + computerHand[0].cardName
        + ' and the ' + computerHand[1].cardName + '. Their score is ' + computerScore + '.</p>'
    while (computerScore < 14) {
        computerTwists()
    }
    if (computerScore > 21) {
        computerPlaysText.innerHTML += '<p>The browser has gone bust.</p>'
    } else {
        computerSticks()
    }
    displayResults()
}

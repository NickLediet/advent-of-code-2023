const path = require('path')
const { readFileSync, writeFileSync } = require('fs')
const puzzleInput = readFileSync(path.resolve('.', 'puzzle-4', 'input.txt')).toString()
const exampleString = `
Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11
Card   1: 99 65 21  4 72 20 77 98 27 70 | 34 84 74 18 41 45 72  2  1 75 52 47 50 93 25 10 79 87 42 69  8 12 54 96 92
Card   2: 51 49 25 92 40 31 18  3 83  4 |  4 40 57 75 16 38 25 92 51  3 36 77 70 94 83 49 18 59 19 31 41 99 43 89 15
Card   3:  5 52 69 84 27 47 17 49 32 98 | 76 82 97  2 17 34 32 31 55 84 87 49 91 81  5 72 23 67 21 35 66 65 44 12 98
Card   4:  2 81 24 58  9 82 21 43 85 83 | 38 21 97 67 82 85 40 24 93 59 53 46  5 15 81 33 22 58  8 89 94  2  3 69 72
`.trim()

const getWinningNumberLookup = (winningNumbers) => winningNumbers.split(' ')
    .reduce((acc, num) => {
        if(num) {
            const cleanNumberMatchValue = num.trim().replace('\\r')  
            acc[cleanNumberMatchValue] = parseInt(cleanNumberMatchValue)
        }
        return acc
    }, {})

const getPoints = (scratchCard) => {
    console.log('------------------------------------')
    let finalScore = 0
    // Split string via pipe
    const [gameDetails, winningNumbers] = scratchCard.split('|')
    // use regex to get the numbers
    const numberMatches = [...gameDetails.matchAll(/\d+\s/g)]
    // build an index of the winning 
    const winningNumbersLookup = getWinningNumberLookup(winningNumbers)
    // iterate over the numbers on the card and check if their winning
    numberMatches.reduce((numbersArray, numberMatch) => {
        const cleanNumberMatchValue = numberMatch[0].trim().replace('\\r')
        if(winningNumbersLookup[cleanNumberMatchValue]) {
            numbersArray.push(parseInt(cleanNumberMatchValue))
        }   
        return numbersArray
    } ,[]).forEach((value, index) => {
        if(index === 0) {
            finalScore = 1
            return
        }
        finalScore *= 2
    })

    return finalScore
}

const getScratchTicketScoreSum = (scratchCardsString) => {
    return scratchCardsString.split('\n')
        .map(scratchCard => getPoints(scratchCard))
        .reduce((acc, tar) => acc + tar, 0)
}

console.log(
    getScratchTicketScoreSum(puzzleInput)
)
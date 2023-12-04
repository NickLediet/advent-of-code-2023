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
`.trim()


const getWinningNumberLookup = (winningNumbers) => winningNumbers.split(' ')
    .reduce((acc, num) => {
        if(num) {
            const cleanNumberMatchValue = num.trim().replace('\\r')  
            acc[cleanNumberMatchValue] = parseInt(cleanNumberMatchValue)
        }
        return acc
    }, {})

const getNumberOfWinningNumbers = (scratchCardMap, {numbers, winningNumbers, numberOfCards}, gameId) => {
    // use regex to get the numbers
    const numberMatches = [...numbers.matchAll(/\d+\s/g)]
    // build an index of the winning 
    const winningNumbersLookup = getWinningNumberLookup(winningNumbers)
    // iterate over the numbers on the card and check if their winning
    const numberOfWinningNumbers = numberMatches.reduce((numbersArray, numberMatch) => {
        const cleanNumberMatchValue = numberMatch[0].trim().replace('\\r')
        if(winningNumbersLookup[cleanNumberMatchValue]) {
            numbersArray.push(parseInt(cleanNumberMatchValue))
        }   
        return numbersArray
    } ,[])
    return numberOfWinningNumbers.length
}
const getFinalAmountOfScratchTickets = (scratchCardsString) => {
    const scratchCardMap = scratchCardsString.split('\n')
        .reduce((map, scratchCard) => {
            const [gameId, rest] = scratchCard.split(':')
            const [numbers, winningNumbers] = rest.split('|')
            map[gameId] = {
                numberOfCards: 1,
                numbers,
                winningNumbers
            }
            return map
        }, {})
    
    Object.keys(scratchCardMap).forEach((key, index) => {
        const numberOfWinningNumbers = getNumberOfWinningNumbers(scratchCardMap, scratchCardMap[key], key)
        const card = scratchCardMap[key]
        if(!numberOfWinningNumbers) return
 

        const cardsToUpdate = Object.keys(scratchCardMap)
            .slice(index + 1, index + numberOfWinningNumbers + 1)

        cardsToUpdate.forEach((key) => {
            const cardToUpdate = scratchCardMap[key]
            cardToUpdate.numberOfCards += card.numberOfCards
        })
    })

    return Object.keys(scratchCardMap)
        .reduce((acc, key) => acc + scratchCardMap[key].numberOfCards, 0)
}

console.log(
    getFinalAmountOfScratchTickets(puzzleInput)
)
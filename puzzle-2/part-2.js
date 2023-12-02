const path = require('path')
const { readFileSync } = require('fs')
const puzzleInput = readFileSync(path.resolve('.', 'puzzle-2', 'input.txt')).toString()

const exampleGames = `
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
`.trim()


// const MAX_CUBES = {
//     r: 12,
//     g: 13,
//     b: 14
// }

// const isValidGame = (roundsString) => {
//     const regexps = {
//         r: /(\d+)\sred/g,
//         g: /(\d+)\sgreen/g,
//         b: /(\d+)\sblue/g
//     }
//     const getInvalidValues = (regexp, limit) => Array.from(roundsString.matchAll(regexp))
//         .filter(matches => limit < matches[1])

//     if(
//         getInvalidValues(regexps.r, MAX_CUBES.r).length > 0 ||
//         getInvalidValues(regexps.b, MAX_CUBES.b).length > 0 ||
//         getInvalidValues(regexps.g, MAX_CUBES.g).length > 0
//     ) {
//         return false
//     }
    
//     return true
// }

// const getGameId = (game) => {
//     return game.match(/Game\s(\d+)/)[1]
// }

// const getSumOfValidGames = (gameString) => gameString.split('\n')
//     .filter(game => isValidGame(game))
//     .reduce((acc, tar) => acc + parseInt(getGameId(tar)), 0)

// console.log(
//     getSumOfValidGames(exampleGames)
// )

// console.log(getSumOfValidGames(puzzleInput))


const getRequiredCubesPerColor = gameString => {
    const regexps = {
        r: /(\d+)\sred/g,
        g: /(\d+)\sgreen/g,
        b: /(\d+)\sblue/g
    }

    const getHighestOfColor = (regexp) => Array.from(gameString.matchAll(regexp))
        .map(matches => matches[1])
        .sort((a, b) => b - a)[0]

    return {
        r: parseInt(getHighestOfColor(regexps.r)),
        g: parseInt(getHighestOfColor(regexps.g)),
        b: parseInt(getHighestOfColor(regexps.b))
    }
}

console.log(
    exampleGames.split('\n')
        .map(getRequiredCubesPerColor)
        .map(({r, g, b}) => r*g*b)
        .reduce((acc, tar) => acc + tar, 0)
)

console.log(
    puzzleInput.split('\n')
        .map(getRequiredCubesPerColor)
        .map(({r, g, b}) => r*g*b)
        .reduce((acc, tar) => acc + tar, 0)
)
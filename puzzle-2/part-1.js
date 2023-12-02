

const exampleGames = `
Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green
`.trim()


const MAX_CUBES = {
    r: 12,
    g: 13,
    b: 14
}

function Game(id, rounds) {
    this.id = id
    this.rounds = rounds
}

function HighestRound(r, g, b) {
    this.r = r
    this.g = g
    this.b = b
}


/**
 * - split game into it's header and rounds
 * - split rounds into and array
 * - loop over the rounds and find the highest values of r, g, b
 * - construct a game object using the ID and the rounds 
 */

const createGamesArray = (gamesString) => gamesString.split('\n')

console.log(createGamesArray(exampleGames))
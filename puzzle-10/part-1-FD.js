const path = require('path')
const { readFileSync, writeFileSync } = require('fs')
const Queue = require('queue')

const puzzleInput = readFileSync(path.resolve('.', 'puzzle-10', 'input.txt')).toString()

const exampleString1 = `
.....
.S-7.
.|.|.
.L-J.
.....
`.trim()

const exampleString2 = `
-L|F7
7S-7|
L|7||
-L-J|
L|-JF
`.trim()

const STARTING_SYMBOL = 'S'
const DIRT_SYMBOL = '.'
const PIPE_CHAR_MAP = {
    [DIRT_SYMBOL]: {
        connects: []
    },
    '|': {
        connects: ['n', 's']
    },
    '-': {
        connects: ['w', 'e']
    },
    'L': {
        connects: ['n', 'e']
    },
    'J': {
        connects: ['w', 'n']
    },
    '7': {
        connects: ['w', 's']
    },
    'F': {
        connects: ['e', 's']
    },
    [STARTING_SYMBOL]: {
        connects: []
    }
}

// Direction map for finding the inverse of the connects
const DIRECTION_PAIR_MAP = {
    's': 'n',
    'n': 's',
    'e': 'w',
    'w': 'e'
}

function printSymbolMatrix(pipeMatrix) {
    console.log(pipeMatrix.map(
        (row) => row.map(({symbol}) => symbol)
    ))

}

function findAdjacentSymbols(symbolMatrix, [ row, col ], predicateFn) {
    const startingPoints = [
        // Top
        [row - 1, col],
        // Right
        [row, col + 1],
        // Bottom
        [row + 1, col],
        // Left
        [col - 1, row]
    ].filter(
        ([r, c]) => !(r < 0 || r > symbolMatrix.length -1 || c < 0 || c > symbolMatrix[c].length || symbolMatrix[r][c].symbol === DIRT_SYMBOL)
    )

    if(typeof predicateFn === 'function') {
        return startingPoints.filter(sp => predicateFn(sp, symbolMatrix))
    }

    return startingPoints
}

/**
 * 
 * @param {*} symbolMatrix 
 * @param {*} param1 
 * @param {*} numberOfSteps 
 * @param {*} param3 
 * @returns {Array[]} a list of number of steps values
 */
function setPathsRecursively(
    symbolMatrix,
    [startingRow, startingCol], 
    stepsTaken = 0,
    [row, col]
) {
    // Reach back to the start, close the loop traversing
    if (
        row !== undefined && startingRow === row &&
        col !== undefined && startingCol === col
    ) return 

    // First call
    if(symbolMatrix[startingRow][startingCol].symbol === STARTING_SYMBOL && row === null && col === null) {
        const nextPoints = findAdjacentSymbols(
            symbolMatrix, 
            [startingRow, startingCol]
        )
        console.log(nextPoints)
        return nextPoints.forEach(np => {
            const [r, c] = np
            symbolMatrix[r][c].steps = stepsTaken
            setPathsRecursively(symbolMatrix, [startingRow, startingCol], 1, [r, c])
        })
    }

    const currentPipe = symbolMatrix[row][col]
    currentPipe.steps = stepsTaken
    const nextPoints = findAdjacentSymbols(
        symbolMatrix, 
        [startingRow, startingCol],
        ([r, c]) => symbolMatrix[r][c].connects.some(
            d => currentPipe.connects.indexOf(DIRECTION_PAIR_MAP[d]) >= 0
        )
    )

    return nextPoints.forEach(np => {
        const [r, c] = np
        console.log(r, c)
        setPathsRecursively(symbolMatrix, [startingRow, startingCol], stepsTaken + 1, [r, c])
    })
}






function findStartingPoint(pipeMatrix) {
    for(let row = 0; row < pipeMatrix.length; row++) {
        for(let col = 0; col < pipeMatrix[row].length; col++) {
            if(pipeMatrix[row][col].symbol === STARTING_SYMBOL) return [row, col]
        }
    }
}

function createPipeMatrix(pipesInputString) {
    return pipesInputString.split('\n').map(
        ln => ln.split('').map(symbol => ({
            ...PIPE_CHAR_MAP[symbol],
            symbol,
            steps: null
        }))
    )
}

function findFurthestPoint(inputString) {
    const pipeMatrix = createPipeMatrix(inputString)
    // const paths = setPathsRecursively(pipeMatrix, findStartingPoint(pipeMatrix))
    // printSymbolMatrix(pipeMatrix)
    // console.log()
    console.log(setPathsRecursively(pipeMatrix, findStartingPoint(pipeMatrix), 1, [1, 2]))
    return pipeMatrix
}

findFurthestPoint(exampleString1)


// findFurthestPoint(exampleString2)
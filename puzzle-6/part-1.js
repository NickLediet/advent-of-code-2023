const path = require('path')
const { readFileSync, writeFileSync } = require('fs')
const puzzleInput = readFileSync(path.resolve('.', 'puzzle-6', 'input.txt')).toString()
const exampleString = `
Time:      7  15   30
Distance:  9  40  200
`.trim()
// const exampleString = `
// Time:      71530
// Distance:  940200
// `.trim()

const parseGameDocument = gameDocumentString => {
    // Just parsing the input string format
    return gameDocumentString.split('\n')
        .reduce((acc, t) =>  {
            const [key, valuesString] = t.split(':')
            const number = Array.from(valuesString.matchAll(/\d+/g)).map(m => m[0]).join('')
            acc[key.toLowerCase()] = [parseInt(number)]
            return acc
        }, [])
}
const calculateHold = (timeHeld, maxTime) => {
    const timeRemaining = maxTime - timeHeld
    const speed = timeHeld
    
    return speed * timeRemaining
}

const getWaysToWinPerRound = ({ time, distance }) => {
    return time.map((t, i) => {
        console.log('-----------------------------------------------------------')
        console.log(`☺ Looking for winning distances that beat ${distance[i]} high score for ${t}ms`)
        // timeHeld = [ 0, time ]
        let rangeValues = []
        for(let i = 0; i <= t; i++) {
            // Last element must fail
            if(i === t) continue

            const distanceTraveled = calculateHold(i, t)
            if (distanceTraveled < distance[i]) {
                console.log(`☑ The rangeValue ${i} amount of time held with ${t - i} a IS NOT ENOUGH. A total ${distanceTraveled}mm traveled`)
            }
                
            console.log(`☒ The rangeValue ${i} amount of time held with ${t - i} amount of time remaining. A total ${distanceTraveled}mm traveled`)
            rangeValues = [...rangeValues, distanceTraveled]
        }
        return rangeValues.length
    })
}

const resolveQuadradicChoices = (gameDocument) => {
    return gameDocument.time.map((t, i) => {
        const d = gameDocument.distance[i]
        const rootOne = (t - Math.sqrt((t**2) - (4 * d)))/2
        const rootTwo = (t + Math.sqrt((t**2) - (4 * d)))/2
        return Math.ceil(rootTwo - 1) - Math.floor(rootOne + 1) + 1
    }) 
}

const calculatePossibleWinProduct = (gameDocumentString) => {
    const gameDocument = parseGameDocument(gameDocumentString)
    if (gameDocument.time.length !== gameDocument.distance.length) {
        throw new Error('Time and Distance are different lengths... bad input')
    }
    const waysToWinPerRound = resolveQuadradicChoices(gameDocument)
    // const waysToWinPerRound = getWaysToWinPerRound(gameDocumentString)

    return waysToWinPerRound
}


console.log(calculatePossibleWinProduct(puzzleInput))
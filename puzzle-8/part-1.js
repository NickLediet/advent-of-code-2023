const path = require('path')
const { readFileSync, writeFileSync } = require('fs')
const puzzleInput = readFileSync(path.resolve('.', 'puzzle-8', 'input.txt')).toString()
const exampleString1 = `
RL

AAA = (BBB, CCC)
BBB = (DDD, EEE)
CCC = (ZZZ, GGG)
DDD = (DDD, DDD)
EEE = (EEE, EEE)
GGG = (GGG, GGG)
ZZZ = (ZZZ, ZZZ)
`.trim()

const exampleString2 = `
LLR

AAA = (BBB, BBB)
BBB = (AAA, ZZZ)
ZZZ = (ZZZ, ZZZ
`.trim()

const LEFT_INDEX = 0
const RIGHT_INDEX = 1
const walkThePaths = (directions, stepMap) => {
    let directionsArray = [...directions]
    let totalSteps = 0
    let currentNode = 'AAA'

    while(currentNode !== 'ZZZ') {
        totalSteps++
        currentNode = stepMap[currentNode][directionsArray[0] === 'R' ? RIGHT_INDEX : LEFT_INDEX]
        directionsArray.push(directionsArray.shift())
    }

    return totalSteps
}

function getNumberOfStepsToComplete(mapInputString) {
    const {directions, ...stepMap} = mapInputString.split('\n').reduce((stepMap, s, i) => {
        if(s.trim() === '') return stepMap
        if(i === 0) {
            stepMap['directions'] = s.split('').filter(c => c === 'R' || c === 'L')
            return stepMap
        }
        const nodeMatches = s.matchAll(/[A-Z]+/g)
        const [key, left, right] = Array.from(nodeMatches).map(m => m[0])
        stepMap[key] = [left, right]
        return stepMap
    }, {})

    return walkThePaths(directions, stepMap)
}

// console.log(getNumberOfStepsToComplete(exampleString1))

console.log(getNumberOfStepsToComplete(exampleString2))
console.log(getNumberOfStepsToComplete(puzzleInput))
const path = require('path')
const { readFileSync, writeFileSync } = require('fs')
const { lcm } = require('mathjs')
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

const exampleString3 = `
LR

11A = (11B, XXX)
11B = (XXX, 11Z)
11Z = (11B, XXX)
22A = (22B, XXX)
22B = (22C, 22C)
22C = (22Z, 22Z)
22Z = (22B, 22B)
XXX = (XXX, XXX)
`

const LEFT_INDEX = 0
const RIGHT_INDEX = 1
function getStepsForCycle(directions, startingNode, stepMap) {
    let directionsArray = [...directions]
    let totalSteps = 0
    let firstZ = ''
    let currentNode = startingNode
    let cycles = []

    while(true) {
        while(totalSteps === 0 || !currentNode.endsWith('Z')) {
            totalSteps++
            currentNode = stepMap[currentNode][directionsArray[0] === 'R' ? RIGHT_INDEX : LEFT_INDEX]
            directionsArray.push(directionsArray.shift())
        }

        cycles.push(totalSteps)
        if(firstZ === '') {
            firstZ = currentNode
            stepCount = 0
        }
        else if (currentNode === firstZ) break
    }

    return cycles
}

function getStartingNodes(stepMap) {
    console.log( Object.keys(stepMap))
    return Object.keys(stepMap).filter(k => k.trim().endsWith('A'))
}

function getNumberOfStepsToComplete(mapInputString) {
    const {directions, ...stepMap} = mapInputString.split('\n').reduce((stepMap, s, i) => {
        if(s.trim() === '') return stepMap
        if(i === 0) {
            console.log('Ye')
            stepMap['directions'] = s.split('').filter(c => c === 'R' || c === 'L')
            return stepMap
        }
        const nodeMatches = s.matchAll(/[A-Z0-9]+/g)
        const [key, left, right] = Array.from(nodeMatches).map(m => m[0])
        stepMap[key] = [left, right]
        return stepMap
    }, {})
    const stepsPerCycle = getStartingNodes(stepMap).map(sn => getStepsForCycle(directions, sn, stepMap))
    console.log(stepsPerCycle)
    return lcm(...stepsPerCycle.map(a => a[0]))
}

// console.log(getNumberOfStepsToComplete(exampleString1))

// console.log(getNumberOfStepsToComplete(exampleString2))
console.log(getNumberOfStepsToComplete(puzzleInput))
// console.log(getNumberOfStepsToComplete(exampleString3))
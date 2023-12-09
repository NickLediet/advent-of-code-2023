const path = require('path')
const { readFileSync, writeFileSync } = require('fs');
const { every, lastIndexOf } = require('lodash')
const puzzleInput = readFileSync(path.resolve('.', 'puzzle-9', 'input.txt')).toString()
const exampleString1 = `
0 3 6 9 12 15
1 3 6 10 15 21
10 13 16 21 30 45
`.trim()

const exampleString2 = `
10 13 16 21 30 45
`.trim()

function buildRecursiveDiffArray(array) {
    const lastSet = array[array.length - 1];
    if(every(lastSet, v => v === 0)) return array

    let currentDiffArray = []
    for(let i = 0; i < lastSet.length - 1; i++) {
        currentDiffArray[i] = lastSet[i + 1] - lastSet[i]
    }

    return buildRecursiveDiffArray([...array, currentDiffArray])
}

function findPredicitionValuesRecursively(diffMatrix, i = 0) {
    if(i === diffMatrix.length) return diffMatrix

    const currentRowIndex = diffMatrix.length - 1 - i
    const lastRowIndex = diffMatrix.length - 1 - (i - 1)
  
    if(i === 0) {
        // Always push a zero value for the last row of the matrix
        diffMatrix[currentRowIndex].push(0)
        return findPredicitionValuesRecursively(diffMatrix, i + 1)
    }

    diffMatrix[currentRowIndex] = [
        diffMatrix[currentRowIndex][0] - diffMatrix[lastRowIndex][0],
        ...diffMatrix[currentRowIndex]
    ]


    return findPredicitionValuesRecursively(diffMatrix, i + 1)
}

function getSumOfExtrapolatedValues(valueString) {
    const initialValues = valueString.split('\n').map(
        ln => Array.from(ln.matchAll(/\-?\d+/gm)).map(m => parseInt(m[0]))
    )

    const diffMatrix = initialValues.map(
        iv => findPredicitionValuesRecursively(buildRecursiveDiffArray([iv]))
    )
    
    return diffMatrix.reduce((sum, history) => sum + history[0][0], 0)
}

console.log(getSumOfExtrapolatedValues(puzzleInput))

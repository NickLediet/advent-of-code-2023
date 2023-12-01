const path = require('path')
const { readFileSync } = require('fs')
const puzzleInput = readFileSync(path.resolve('.', 'puzzle-1', 'input.txt')).toString()
console.log(puzzleInput)
const exampleString = `
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
`

const toCalibrationArray = string => string.trim().split('\n')
const getCalibrationValue = string => {
    const { firstValue, lastValue } = string.split('')
        .reduce((acc, cur) => {
            if(!parseInt(cur)) return acc
            if(!acc.firstValue) {
                return {
                    firstValue: cur,
                    lastValue: cur
                }
            }

            return {...acc, lastValue: cur}
        }, {})
        
    return parseInt(firstValue + lastValue)
}
const getSumOfCalibrationValues = string => toCalibrationArray(string)
    .map(getCalibrationValue)
    .reduce((acc, current) => acc + current, 0)

const testResults = getSumOfCalibrationValues(exampleString)
console.log(testResults)

const results = getSumOfCalibrationValues(puzzleInput)
console.log(results)
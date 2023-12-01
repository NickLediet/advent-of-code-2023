const path = require('path')
const { readFileSync } = require('fs')
const puzzleInput = readFileSync(path.resolve('.', 'puzzle-1', 'input.txt')).toString()

const exampleString = `
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
`
const replaceNumericSubStringsWithNumbers = (string) => {
    const numericStrings = [
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine'
    ]
    let newString = string
    numericStrings.forEach((number, index) => (newString = newString.replace(number, index + 1)))
    return newString
}
const toCalibrationArray = string => string.trim().split('\n')
const getCalibrationValue = string => {
    const { firstValue, lastValue } = replaceNumericSubStringsWithNumbers(string)
        .split('')
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
    console.log({ firstValue, lastValue })
    return parseInt(firstValue + lastValue)
}
const getSumOfCalibrationValues = string => toCalibrationArray(string)
    .map(getCalibrationValue)
    .reduce((acc, current) => acc + current, 0)

const testResults = getSumOfCalibrationValues(exampleString)
console.log(testResults)

// const results = getSumOfCalibrationValues(puzzleInput)
// console.log(results)
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

const pickedTestString = `
5vnntgqnrpjh537ninebbkcs6
asdasdkthreeaskjhasd
onejgnvdndtwoqpdxbnzhkg91sevenrfgv,
onesevenfivefour5four413
`

/**
 * @param {string} stringFragment
 * @returns {number|null}
 */
const getNumberFragment = stringFragment => {
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

    if(/\d/.test(stringFragment)) {
        return stringFragment.match(/\d/)[0]
    }

    for(let i = 0; i < numericStrings.length; i++) {
        const hasNumber = new RegExp(`${numericStrings[i]}`).test(stringFragment)
        if(hasNumber) return i + 1
    }

    return null
}

const buildFragments = (string) => {
    const initialChars = string.split('')
    let builtString = ''
    let currentString = ''
    let stringFragments = []

    for(let i = 0; i < initialChars.length; i++) {
        builtString += initialChars[i]
        currentString += initialChars[i]

        const numberFragment = getNumberFragment(currentString)
        if(numberFragment) {
            stringFragments.push(numberFragment)
            currentString = ''
        }
    }

    return stringFragments.join('')
}

const toCalibrationArray = string => string.trim().split('\n')

const getCalibrationValue = string => {
    const { firstValue, lastValue } = buildFragments(string)
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
    console.log(firstValue, lastValue)
    return parseInt(firstValue + lastValue)
}

const getSumOfCalibrationValues = string => toCalibrationArray(string)
    .map(getCalibrationValue)
    .reduce((acc, current) => acc + current, 0)

// const testResults = getSumOfCalibrationValues(exampleString)
// console.log(testResults)

const pickedResults = getSumOfCalibrationValues(pickedTestString)
console.log(pickedResults)

const results = getSumOfCalibrationValues(puzzleInput)
console.log(results)

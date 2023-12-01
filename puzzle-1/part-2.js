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
eightwoasdjhkasjd
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

const findNumber = (string, reversed = false) => {
    const initialChars = string.split('')
    let builtString = ''

    for(let i = 0; i < initialChars.length; i++) {
        builtString = reversed ?
            initialChars[initialChars.length - 1 - i] + builtString : 
            builtString + initialChars[i]
        const numberFragment = getNumberFragment(builtString)
        if(numberFragment) return String(numberFragment)
    }

    return null
}

const toCalibrationArray = string => string.trim().split('\n')

const getCalibrationValue = string => parseInt(findNumber(string) + findNumber(string, true))

const getSumOfCalibrationValues = string => toCalibrationArray(string)
    .map(getCalibrationValue)
    .reduce((acc, current) => acc + current, 0)

const testResults = getSumOfCalibrationValues(exampleString)
console.log(testResults)

const pickedResults = getSumOfCalibrationValues(pickedTestString)
console.log(pickedResults)

const results = getSumOfCalibrationValues(puzzleInput)
console.log(results)

const path = require('path')
const { readFileSync } = require('fs')
const puzzleInput = readFileSync(path.resolve('.', 'puzzle-3', 'input.txt')).toString()
const exampleString = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`.trim()


const checkRow = (schematicLine, start, end) => {
    const symbols = Array.from(schematicLine.slice(start, end)
        .matchAll(/[^0-9\.\s]/g))
    return symbols.length && symbols.length > 0
}

const checkAdjacentSymbols = ({start, end, index, schematicLines, schematicLine}) => {
    let foundSymbol = false
    if(index !== 0) {
        // check last 
        foundSymbol = checkRow(
            schematicLines[index - 1], 
            // if not the first chars in row otherwise use start
            start === 0 ? start: start - 1,
            // Same but for end
            end === schematicLine.length - 1 ? end: end + 1 
        )
    }

    if(!foundSymbol) {
        // Check current line
        foundSymbol = checkRow(
            schematicLines[index], 
            // if not the first chars in row otherwise use start
            start === 0 ? start: start - 1,
            // Same but for end
            end === schematicLine.length - 1 ? end: end + 1 
        )
    }

    // Check the next line
    if(index + 1 !== schematicLines.length && !foundSymbol) {
        foundSymbol = checkRow(
            schematicLines[index + 1],
            // if not the first chars in row otherwise use start
            start === 0 ? start: start - 1,
            // Same but for end
            end === schematicLine.length - 1 ? end: end + 1 
        )
    }
    
    return foundSymbol
}


const findPartNumbers = (schematicLines, schematicLine, index) => {
    let numberMatches = Array.from(schematicLine.matchAll(/\d+/g))
    if(!numberMatches.length) {
        return null
    }

    partNumbers = numberMatches.reduce((validPartNumbers, numberMatch) => {
        const hasAdjacentSymbol = checkAdjacentSymbols({ 
            start: numberMatch.index,
            end: numberMatch.index + numberMatch[0].length,
            index,
            schematicLines,
            schematicLine
         }) 
         if(hasAdjacentSymbol) validPartNumbers.push(parseInt(numberMatch[0]))
         return validPartNumbers
    }, [])


    // start => the index that the number starts at, end => the ending index, 
    // lineIndex => index in the schematic lines of this current line
    return partNumbers
}

const findPartNumberSum = (schematicString) => {
    const schematicLines = schematicString.split('\n')
    const partNumbers = schematicLines.reduce((acc, schematicLine, index) => {
        const partNumbers = findPartNumbers(schematicLines, schematicLine, index)
        if(partNumbers && partNumbers.length) {
            acc.push(partNumbers)
        }
        return acc
    }, [])

    return partNumbers.flat()
        .reduce((acc, pn) => acc + pn, 0)
}


console.log(
    findPartNumberSum(puzzleInput)
)

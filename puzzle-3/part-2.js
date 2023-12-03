const path = require('path')
const { readFileSync, writeFileSync } = require('fs')
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
    const numberMatches = Array.from(schematicLine.matchAll(/\d+/g))
    if(!numberMatches) return []
    return numberMatches.filter(numberMatch => {
        const numberMatchStartIndex = numberMatch.index
        const numberMatchEndIndex = numberMatchStartIndex + numberMatch[0].length - 1
        
        return (numberMatchStartIndex >= start && numberMatchStartIndex <= end) ||
            (numberMatchEndIndex >= start && numberMatchEndIndex <= end)
    }).map(match => match[0])
}

const checkAdjacentSymbols = ({start, index, schematicLines, schematicLine}) => {
    let foundNumbers = []
    let rowResult
    if(index !== 0) {
        // check last 
        rowResult = checkRow(
            schematicLines[index - 1], 
            // if not the first chars in row otherwise use start
            start === 0 ? start: start - 1,
            // Same but for end
            start === schematicLine.length - 1 ? start: start + 1 
        )
        if(rowResult.length) foundNumbers.push(...rowResult)
    }


    // Check current line
    rowResult = checkRow(
        schematicLines[index], 
        // if not the first chars in row otherwise use start
        start === 0 ? start: start - 1,
        // Same but for start
        start === schematicLine.length - 1 ? start: start + 1 
    )
    if(rowResult.length) foundNumbers.push(...rowResult)



    // Check the next line
    if(index + 1 !== schematicLines.length) {
        rowResult = checkRow(
            schematicLines[index + 1],
            // if not the first chars in row otherwise use start
            start === 0 ? start: start - 1,
            // Same but for start
            start === schematicLine.length - 1 ? start: start + 1 
        )
        if (rowResult.length) foundNumbers.push(...rowResult)
    }
    
    const isValidGear = foundNumbers.length === 2
    return [isValidGear, foundNumbers]
}


const findGearRatios = (schematicLines, schematicLine, index) => {
    let gearRatioSymbolMatches = Array.from(schematicLine.matchAll(/\*/g))
    if(!gearRatioSymbolMatches.length) {
        return null
    }
    return gearRatioSymbolMatches.reduce((validGearRatios, gearSymbolMatch) => {
        const [isValidGear, gearRatio] = checkAdjacentSymbols({ 
            start: gearSymbolMatch.index,
            index,
            schematicLines,
            schematicLine
         }) 
         if(isValidGear) validGearRatios.push(parseInt(gearRatio[0]) * parseInt(gearRatio[1]))
         return validGearRatios
    }, [])
}

const findGearRatiosSum = (schematicString) => {
    const schematicLines = schematicString.split('\n')
    const gearRatios = schematicLines.reduce((acc, schematicLine, index) => {
        const gearRatioResults = findGearRatios(schematicLines, schematicLine, index)
        if(gearRatioResults && gearRatioResults.length) {
            acc.push(gearRatioResults)
        }
        return acc
    }, [])

    return gearRatios.flat()
        .reduce((acc, pn) => acc + pn, 0)
}


console.log(
    findGearRatiosSum(puzzleInput)
)

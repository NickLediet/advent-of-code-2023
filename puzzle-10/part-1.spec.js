const path = require('path')
const { readFileSync } = require('fs')
const { findFurthestPoint } = require('./part-1')
const puzzleInput = readFileSync(path.resolve('.', 'puzzle-10', 'input.txt')).toString()
const exampleInput = readFileSync(path.resolve('.', 'puzzle-10', 'example.txt')).toString()
const exampleString1 = `
..F7.
.FJ|.
SJ.L7
|F--J
LJ...
`.trim()
const exampleString2 = `
F-7
|SJ
LJ.
`.trim()

describe('puzzle-10/part-1', () => {

    describe('> final solution', () => {
        // test('exampleInput from reddit shoud = 3022', () => {
        //     expect(findFurthestPoint(exampleInput)).toEqual(3022)
        // })

        test('exampleString1 should equal 8', () => {
            expect(findFurthestPoint(exampleString1)).toEqual(8)
        })

        test('exampleString2 should equal 4', () => {
            expect(findFurthestPoint(exampleString2)).toEqual(4)
        })
    })
})
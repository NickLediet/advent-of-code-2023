function findStartingPoint(pipeMatrix) {
    for(let row = 0; row < pipeMatrix.length; row++) {
        for(let col = 0; col < pipeMatrix[row].length; col++) {
            if(pipeMatrix[row][col] === 'S') return [row, col]
        }
    }
}

function createPipeMatrix(pipesInputString) {
    return pipesInputString.split('\n').map(ln => ln.split('')).filter(ln => ln.length !== 0)
}

function walkPath(pipeMatrix, [sr, sc]) {
    const q = [[sr, sc]]
    const loop = [[sr, sc]]

    while(q.length > 0) {
        const [r, c] = q.shift()
        const char = pipeMatrix[r][c]

        if(
            r > 0 &&
            '|7F'.indexOf(pipeMatrix[r - 1][c]) > -1 &&
            'S|JL'.indexOf(char) > -1 &&
            loop.map(([lr, lc]) => `${lr}${lc}`).indexOf(`${r - 1}${c}`) === -1
        ) {
            loop.push([r - 1, c])
            q.push([r - 1, c])
        } 
        if(
            r < (pipeMatrix.length - 1) &&
            'S|7F'.indexOf(char) > -1 &&
            '|JL'.indexOf(pipeMatrix[r + 1][c]) > -1 &&
            loop.map(([lr, lc]) => `${lr}${lc}`).indexOf(`${r + 1}${c}`) === -1
        ) {
            loop.push([r + 1, c])
            q.push([r + 1, c])
        }
        if(
            c > 0 &&
            'S-J7'.indexOf(char) > -1 &&
            '-LF'.indexOf(pipeMatrix[r][c - 1]) > -1 &&
            loop.map(([lr, lc]) => `${lr}${lc}`).indexOf(`${r}${c - 1}`) === -1
        ) {
            loop.push([r, c - 1])
            q.push([r, c - 1])
        }
        if(
            c < (pipeMatrix[r].length - 1) &&
            'S-LF'.indexOf(char) > -1 &&
            '-J7'.indexOf(pipeMatrix[r][c + 1]) > -1 &&
            loop.map(([lr, lc]) => `${lr}${lc}`).indexOf(`${r}${c + 1}`) === -1
        ) {
            loop.push([r, c + 1])
            q.push([r, c + 1])
        }
    }
    
    return loop
}

function visualizeMap(mapMatrix, steps, stepCount) {
    const newMatrix = [...mapMatrix]
    steps.forEach(([r, c], i) => {
        if(newMatrix[r][c]) {
            newMatrix[r][c] = 'G'
        }
    })
    return newMatrix
}

function findFurthestPoint(inputString) {
    console.log('---------------------------------')
    const pipeMatrix = createPipeMatrix(inputString.replace(/\r/g, ''))
    const [sr, sc] = findStartingPoint(pipeMatrix)
    const steps = walkPath(pipeMatrix, [sr, sc])
    // console.log('Unique symbols in string: ', [...new Set(pipeMatrix.flat())])
    // console.log('Lengths of each row', [...new Set(pipeMatrix.map(r => r.length))])
    // console.log('Last column of second row....', pipeMatrix[1][pipeMatrix[0].length - 1])
    // console.log(pipeMatrix[0].slice(pipeMatrix.length - 20, 20))
        // console.log(pipeMatrix)

    // console.log(visualizeMap(pipeMatrix, steps, stepsLoop))
    return steps.length / 2
}

// console.log(findFurthestPoint(exampleString3))
// console.log(findFurthestPoint(exampleString1))
// console.log(findFurthestPoint(exampleString4))

// console.log(findFurthestPoint(exampleInput))

// findFurthestPoint(exampleString2)

module.exports = {
    findFurthestPoint,
    visualizeMap,
    walkPath,
    findFurthestPoint,
    createPipeMatrix
}
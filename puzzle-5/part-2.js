const path = require('path')
const { readFileSync, writeFileSync } = require('fs')
const puzzleInput = readFileSync(path.resolve('.', 'puzzle-5', 'input.txt')).toString()
const exampleString = `
seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4
`.trim()

const getMapValuesInRange = (line) => {
    const [destination, source, range] = line.split(' ').map(n => parseInt(n))
    return { sourceStart: source, sourceEnd: source + range, range, destination }
}

const createMapOfMaps = (mapString) => {
    const mapSubStrings = mapString.split('\n')
    let lastKey = ''
    return mapSubStrings.reduce((mapOfMaps, line) => {
        if(line.trim() === '') return mapOfMaps
        if(line.match(/:/)) {

            const simpleLineKey = line.replace(' map:', '')
            mapOfMaps[simpleLineKey] = []
            lastKey = simpleLineKey
            return mapOfMaps
        }
        const sourceRange = getMapValuesInRange(line)
        if(!mapOfMaps[lastKey]) {
            console.log({
                lastKey, line,
            })
        }
        mapOfMaps[lastKey] = [...mapOfMaps[lastKey], sourceRange]
        return mapOfMaps
    }, {})
}

const inRange = (inputStart, inputRange, sourceStart, sourceRange) => 
    (inputStart >= sourceStart) || ((inputStart + inputRange) <= (sourceStart + sourceRange))

const getConvertFunction = (map, typeKey, [inputStart, inputRange]) => {
    const matchingRange = map[typeKey].filter(
        ({ sourceStart, sourceEnd, range}) => inRange()
    )
    if(!matchingRange.length) {
        return source
    }
    const {sourceStart, destination} = matchingRange[0]
    const diff = source - sourceStart
    return destination + diff
}

const inverseLookupMap = (map, y) => {
    for(let i = 0; i < map.length; i++) {
        const {sourceStart, destination, range} = map[i]
        if(destination <= y && y < destination + range) {
            return sourceStart + (y - destination)
        }
    }
    return y
}

const createInvertedMap = (map) => {
    let lastKey = ''
    return Object.keys(map).reverse()
        .reduce((acc, k, i) => {
            let currentMapEndpoints = map[k].map(({ sourceStart, destination, range }) => [
                [destination, sourceStart], 
                // Build out the endpoints
                [destination + range - 1, sourceStart + range - 1]
            ]).flat()
            
            currentMapEndpoints.sort((a, b) => a[0] - b[0])

            const outputEndPoints = lastKey !== '' ? acc[lastKey] : [0, Number.MAX_SAFE_INTEGER]
            const outputSourceEndpoints = [... new Set(outputEndPoints
                .map((y) => inverseLookupMap(map[k], y))
                .sort((a, b) => a - b))]

            const inputSourceEndpoints = currentMapEndpoints.map(([x, y]) => y)
            const finalOutputEndpoints = [...new Set([...new Set(outputSourceEndpoints), ...new Set(inputSourceEndpoints)])]
            acc[k] = finalOutputEndpoints.sort((a, b) => a - b)
            lastKey = k
            return acc
        }, {})
}

const getLowestSeedDestination = (almanac) => {
    const [seedsString, ...mapLines] = almanac.split('\n')
    // const seeds = Array.from(seedsString.matchAll(/\d+/g))
    //     .map(s => parseInt(s))
    //     // Return tuples of starting seed value and range
    //     .reduce((acc, cur) =>  {
    //         const lastElementHasSpace = acc.length && acc[acc.length - 1].length === 1
    //         if(lastElementHasSpace) {
    //             acc[acc.length - 1].push(cur)
    //             return acc
    //         }

    //         acc.push([cur])
    //         return acc
    //     }, [])
    //     .reduce((acc, [seedStart, seedRange]) => {
    //         let seedsToAdd = []
    //         for(let i = parseInt(seedStart); i < seedStart + seedRange; i++) {
    //             seedsToAdd.push(i)
    //         }
            
    //         return [...acc, ...seedsToAdd]
    //     }, [])
 
    const mapOfMaps = createMapOfMaps(mapLines.join('\n'))
    // console.log(mapOfMaps)
    const invertedMap = createInvertedMap(mapOfMaps)
    console.log(invertedMap)
    return;
    const locationNumbers = seeds.map(
        (seed) => Object.keys(mapOfMaps).reduce(
            (convertedValue, key) => getConvertFunction(mapOfMaps, key, convertedValue), seed
        )
    )
    return locationNumbers.sort((a,b) => a - b)[0]
}

const getSpecificSeedConversions = (string, seedNumber) => {
    const [seedsString, ...mapLines] = string.split('\n')
    const mapOfMaps = createMapOfMaps(mapLines.join('\n'))
    let lastKey = ''
    const locationNumbers = Object.keys(mapOfMaps).reduce((convertedValue, key) => {
        const map = {
            ...convertedValue,
            [key]: getConvertFunction(mapOfMaps, key, !lastKey ? seedNumber: convertedValue[lastKey])
        }
        lastKey = key
        return map
    }, { seedNumber })
    
    return locationNumbers
}

console.log(getLowestSeedDestination(exampleString))

// console.log(getSpecificSeedConversions(exampleString, 79))


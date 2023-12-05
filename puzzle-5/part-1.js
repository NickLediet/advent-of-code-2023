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

const getConvertFunction = (map, typeKey, source) => {
    const matchingRange = map[typeKey].filter(
        ({ sourceStart, sourceEnd, range}) => source >= sourceStart && source <= sourceEnd
    )
    if(!matchingRange.length) {
        return source
    }
    const {sourceStart, destination} = matchingRange[0]
    const diff = source - sourceStart
    return destination + diff
}

const getLowestSeedDestination = (almanac) => {
    const [seedsString, ...mapLines] = almanac.split('\n')
    const seeds = Array.from(seedsString.matchAll(/\d+/g)).map(s => parseInt(s))
    const mapOfMaps = createMapOfMaps(mapLines.join('\n'))
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

console.log(getLowestSeedDestination(puzzleInput))

// console.log(getSpecificSeedConversions(exampleString, 79))
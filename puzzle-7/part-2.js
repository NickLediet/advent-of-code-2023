const path = require('path')
const { readFileSync, writeFileSync } = require('fs')
const { groupBy } = require('lodash')
const puzzleInput = readFileSync(path.resolve('.', 'puzzle-7', 'input.txt')).toString()
// const exampleString = `
// 32T3K 765
// T55J5 684
// KK677 28
// KTJJT 220
// QQQJA 483
// `.trim()
const exampleString = `
2345A 1
Q2KJJ 13
Q2Q2Q 19
T3T3J 17
T3Q33 11
2345J 3
J345A 2
32T3K 5
T55J5 29
KK677 7
KTJJT 34
QQQJA 31
JJJJJ 37
JAAAA 43
AAAAJ 59
AAAAA 61
2AAAA 23
2JJJJ 53
JJJJ2 41
`
/**
 * - scoring algo
 * - parsing 
 * - quick sort values
 */

const CARDS_IN_ORDER = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2', 'J'].reverse()
const HAND_TYPE_MAP = {
    '5OAK': {
        name: 'Five of a kind',
        callback: (cardsIndexMap) => Object.values(cardsIndexMap)
            .some(p => p === 5) 
    },
    '4OAK': {
        name: 'Four of a kind',
        callback: (cardsIndexMap) => Object.values(cardsIndexMap)
            .some(p => p === 4)
    },
    'FH': {
        name: 'Full house',
        callback: (cardsIndexMap) => Object.values(cardsIndexMap)
            .some(p => p === 3) && HAND_TYPE_MAP['1P'].callback(cardsIndexMap)
    },
    '3OAK': {
        name: 'Three of a kind',
        callback: (cardsIndexMap) => Object.values(cardsIndexMap)
            .some(p => p === 3)
    },
    '2P': {
        name: 'Two Pairs',
        callback: (cardsIndexMap) => Object.values(cardsIndexMap)
            .filter(p => p === 2).length === 2
    },
    '1P': {
        name: '1 Pair',
        callback: (cardsIndexMap) => Object.values(cardsIndexMap)
            .some(p => p === 2)
    },
    'HC': {
        name: 'High card',
        callback: () => true
    }
}

function getCardIndexMap(cardsArray) {
    return cardsArray.reduce((map, c) => {
        if(!Object.hasOwn(map, c)) {
            map[c] = 1
            return map
        }

        map[c] = map[c] + 1
        return map
    }, {})
}
function getHandDetails ([cards, bet]) {
    const cardsArray = cards.split('')
    let curretHandType = ''
    const {J: jokerCount, ...cardIndexMap} = getCardIndexMap(cardsArray)
    const cardKeys = Object.keys(cardIndexMap)

    const highestValue = cardKeys.length === 1 ?
        cardKeys[0] :
        cardKeys.sort((a, b) => cardIndexMap[b] - cardIndexMap[a])[0]

    if(jokerCount) {
        // if all jokers
        if(jokerCount !== 5 && cardKeys) {
            cardIndexMap[highestValue] = cardIndexMap[highestValue] + jokerCount
        } else {
            cardIndexMap['J'] = jokerCount
        }
    }

    Object.keys(HAND_TYPE_MAP)
        .forEach((htk) => {
            if(curretHandType) return
            const isOfType = HAND_TYPE_MAP[htk].callback(cardIndexMap)
            if(isOfType) {
                curretHandType = htk
            }
        })
    return { cards, bet, handType: curretHandType, cardsArray }
}

function checkCardScore (a, b) {
    const cardsArrayA = a.cardsArray
    const cardsArrayB = b.cardsArray
    const checkIfAIsHigher = (aChar, bChar) => CARDS_IN_ORDER.indexOf(aChar) + 1 > CARDS_IN_ORDER.indexOf(bChar) + 1
    for(let i = 0; i < cardsArrayA.length; i++) {
        if(cardsArrayA[i] === cardsArrayB[i]) continue
        const isAHigher = checkIfAIsHigher(cardsArrayA[i], cardsArrayB[i])
        return isAHigher ? 1 : -1
    }
    return 0
}

function getScoreAndRank(cards) {
    let currentRank = 1
    const chunkedCardsMap = groupBy(cards, c => c.handType)
    const orderedHandTypes = Object.keys(HAND_TYPE_MAP).reverse()
    const getWinnings = (bet, rank) => parseInt(bet) * parseInt(rank)
    const winningsAndRanks = orderedHandTypes.reduce((winRankArray, handTypeGroupKey) => {
        const handTypeGroup = chunkedCardsMap[handTypeGroupKey] || []
        // No items in this type
        if(handTypeGroup.length === 0) return winRankArray
        // Easy assignment, no sorting required
        if(handTypeGroup.length === 1) {
            const rank = currentRank
            currentRank++
            return [
                ...winRankArray,
                {
                    ...handTypeGroup[0],
                    rank,
                    winnings: getWinnings(handTypeGroup[0].bet, rank)
                }
            ]
        }
        // find the ordered best cards and rank them
        const orderedCards = [...handTypeGroup].sort((a, b) => checkCardScore(a, b))

        return [
            ...winRankArray,
            ...orderedCards.map(c => {
                const rank = currentRank
                currentRank++
                return {
                    ...c,
                    rank,
                    winnings: getWinnings(c.bet, rank)
                }
            })
        ]
    }, [])
    return winningsAndRanks
}

function getTotalWinnings(handsString) {
    const hands = handsString.split('\n').filter(hs => hs !== '').map(s => s.split(' '))
    const handDetails = hands.map((hand) => getHandDetails(hand))
    const scoresAndRanks = getScoreAndRank(handDetails)
    return scoresAndRanks.reduce((sum, card) => sum + card.winnings, 0)
}

console.log(getTotalWinnings(puzzleInput))

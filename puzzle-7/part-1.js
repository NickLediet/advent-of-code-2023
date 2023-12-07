const path = require('path')
const { readFileSync, writeFileSync } = require('fs')
const { groupBy } = require('lodash')
const puzzleInput = readFileSync(path.resolve('.', 'puzzle-7', 'input.txt')).toString()
const exampleString = `
32T3K 765
T55J5 684
KK677 28
KTJJT 220
QQQJA 483
`.trim()

/**
 * - scoring algo
 * - parsing 
 * - quick sort values
 */

const CARDS_IN_ORDER = ['A', 'K', 'Q', 'T', '9', '8', '7', '6', '5', '4', '3', '2'].reverse()
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
    let curretHandType = 'HC'
    const cardIndexMap = getCardIndexMap(cardsArray)

    Object.keys(HAND_TYPE_MAP).reverse()
        .forEach((htk) => {
            const isOfType = HAND_TYPE_MAP[htk].callback(cardIndexMap)
            
            if(isOfType) {
                curretHandType = htk
                if(htk === '5OAK') console.log('This cards is 50AK: ', cards)
            }
        })
    return { cards, bet, handType: curretHandType, cardsArray }
}

function checkCardScore (a, b) {
    const cardsArrayA = a.cardsArray
    const cardsArrayB = b.cardsArray

    for(let i = 0; i < cardsArrayA.length; i++) {
        if(cardsArrayA[i] === cardsArrayB[i]) continue
        return CARDS_IN_ORDER.indexOf(cardsArrayA[i]) - CARDS_IN_ORDER.indexOf(cardsArrayB[i])
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
    const hands = handsString.split('\n').map(s => s.split(' '))
    const handDetails = hands.map((hand) => getHandDetails(hand))
    const scoresAndRanks = getScoreAndRank(handDetails)
    console.log(scoresAndRanks.reverse().slice(0, 30))
    return scoresAndRanks.reduce((sum, card) => sum + card.winnings, 0)
}

console.log(getTotalWinnings(puzzleInput))
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotal = exports.calculateSum = exports.validateScore = exports.rollDices = exports.createScoreboardColumn = exports.createGameDices = exports.createSlug = void 0;
var types_1 = require("../types");
var createSlug = function () {
    var alphabets = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var slug = '';
    for (var i = 0; i < 4; i++) {
        slug += alphabets.charAt(Math.floor(Math.random() * alphabets.length));
    }
    return slug;
};
exports.createSlug = createSlug;
var createGameDices = function (numOfDices) {
    var dices = [];
    for (var i = 0; i < numOfDices; i++) {
        var dice = {
            selected: false,
            value: Math.floor(Math.random() * 6) + 1,
        };
        dices.push(dice);
    }
    return dices;
};
exports.createGameDices = createGameDices;
var createScoreboardColumn = function (user) {
    var rows = Object.values(types_1.ScoreboardRowName).map(function (name) { return ({
        name: name,
        score: 0,
        filled: false,
    }); });
    return {
        player: user._id,
        rows: rows,
    };
};
exports.createScoreboardColumn = createScoreboardColumn;
var rollDices = function (dices) {
    return dices.map(function (dice) {
        if (!dice.selected)
            dice.value = Math.floor(Math.random() * 6) + 1;
        return dice;
    });
};
exports.rollDices = rollDices;
var sortDices = function (dices) {
    var sortedDices = new Map();
    for (var i = 0; i < dices.length; i++) {
        sortedDices.set(dices[i].value, (sortedDices.get(dices[i].value) || 0) + 1);
    }
    return sortedDices;
};
var validateScore = function (dices, rowName) {
    switch (rowName) {
        case types_1.ScoreboardRowName.Aces:
            return calculateUpperSectionRow(dices, 1);
        case types_1.ScoreboardRowName.Twos:
            return calculateUpperSectionRow(dices, 2);
        case types_1.ScoreboardRowName.Threes:
            return calculateUpperSectionRow(dices, 3);
        case types_1.ScoreboardRowName.Fours:
            return calculateUpperSectionRow(dices, 4);
        case types_1.ScoreboardRowName.Fives:
            return calculateUpperSectionRow(dices, 5);
        case types_1.ScoreboardRowName.Sixes:
            return calculateUpperSectionRow(dices, 6);
        case types_1.ScoreboardRowName.Pair:
            return calculatePair(dices);
        case types_1.ScoreboardRowName.TwoPairs:
            return calculateTwoPairs(dices);
        case types_1.ScoreboardRowName.ThreeOfKind:
            return calculateThreeOfAKind(dices);
        case types_1.ScoreboardRowName.FourOfKind:
            return calculateFourOfAKind(dices);
        case types_1.ScoreboardRowName.SmallStraight:
            return calculateSmallStraight(dices);
        case types_1.ScoreboardRowName.LargeStraight:
            return calculateLargeStraight(dices);
        case types_1.ScoreboardRowName.Fullhouse:
            return calculateFullHouse(dices);
        case types_1.ScoreboardRowName.Chance:
            return calculateChance(dices);
        case types_1.ScoreboardRowName.Yatzy:
            return calculateYatzy(dices);
        default:
            return 0;
    }
};
exports.validateScore = validateScore;
var calculateUpperSectionRow = function (dices, diceValue) {
    var groupedDiceValue = sortDices(dices);
    return (groupedDiceValue.get(diceValue) || 0) * diceValue;
};
var calculatePair = function (dices) {
    var groupedDiceValue = sortDices(dices);
    var pair = 0;
    groupedDiceValue.forEach(function (value, key) {
        if (value >= 2 && key * 2 > pair) {
            pair = key * 2;
        }
    });
    return pair;
};
var calculateTwoPairs = function (dices) {
    var groupedDiceValue = sortDices(dices);
    var twoPairs = 0;
    if (groupedDiceValue.size >= 2 && groupedDiceValue.size <= 3) {
        if (groupedDiceValue.size === 3) {
            groupedDiceValue.forEach(function (value, key) {
                if (value === 2) {
                    twoPairs += key * 2;
                }
            });
        }
        else if (groupedDiceValue.size === 2) {
            groupedDiceValue.forEach(function (value, key) {
                if (value >= 2 && value < 4) {
                    twoPairs += key * 2;
                }
            });
        }
    }
    return twoPairs;
};
var calculateThreeOfAKind = function (dices) {
    var groupedDiceValue = sortDices(dices);
    var threeOfAKind = 0;
    groupedDiceValue.forEach(function (value, key) {
        if (value >= 3) {
            threeOfAKind = key * 3;
        }
    });
    return threeOfAKind;
};
var calculateFourOfAKind = function (dices) {
    var groupedDiceValue = sortDices(dices);
    var fourOfAKind = 0;
    groupedDiceValue.forEach(function (value, key) {
        if (value >= 4) {
            fourOfAKind = key * 4;
        }
    });
    return fourOfAKind;
};
var calculateSmallStraight = function (dices) {
    var groupedDiceValue = sortDices(dices);
    if (groupedDiceValue.size === 5 && groupedDiceValue.get(1) && !groupedDiceValue.get(6)) {
        return 15;
    }
    return 0;
};
var calculateLargeStraight = function (dices) {
    var groupedDiceValue = sortDices(dices);
    if (groupedDiceValue.size === 5 && groupedDiceValue.get(6) && !groupedDiceValue.get(1)) {
        return 20;
    }
    return 0;
};
var calculateFullHouse = function (dices) {
    var groupedDiceValue = sortDices(dices);
    var fullHouse = 0;
    if (groupedDiceValue.size === 2) {
        groupedDiceValue.forEach(function (value, key) {
            if (value >= 2 && value <= 3) {
                fullHouse += value * key;
            }
        });
    }
    return fullHouse;
};
var calculateChance = function (dices) {
    var chance = 0;
    dices.forEach(function (dice) {
        chance += dice.value;
    });
    return chance;
};
var calculateYatzy = function (dices) {
    var groupedDiceValue = sortDices(dices);
    if (groupedDiceValue.size === 1) {
        return 50;
    }
    return 0;
};
var calculateSum = function (scoreboardRows) {
    var sum = 0;
    if (scoreboardRows.find(function (row) { return !row.filled; })) {
        return;
    }
    scoreboardRows.forEach(function (row) {
        sum += row.score;
    });
    return sum;
};
exports.calculateSum = calculateSum;
var calculateTotal = function (scoreboardRows) {
    var total = 0;
    if (scoreboardRows.find(function (row) { return !row.filled; })) {
        return;
    }
    scoreboardRows.forEach(function (row) {
        total += row.score;
    });
    return total;
};
exports.calculateTotal = calculateTotal;

import { Dice, PublicUser, ScoreboardColumn, ScoreboardRow, ScoreboardRowName, } from "../types";

export const createSlug = (): string => {
    const alphabets = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let slug = '';

    for (let i = 0; i < 4; i++) {
        slug += alphabets.charAt(Math.floor(Math.random() * alphabets.length));
    }

    return slug;
};

export const createGameDices = (numOfDices: number): Dice[] => {
    const dices: Dice[] = [];

    for (let i = 0; i < numOfDices; i++) {
        const dice: Dice = {
            selected: false,
            value: Math.floor(Math.random() * 6) + 1,
        };
        dices.push(dice);
    }

    return dices;
};

export const createScoreboardColumn = (user: PublicUser): ScoreboardColumn => {
    const rows = Object.values(ScoreboardRowName).map(name => ({
        name,
        score: 0,
        filled: false,
    }));

    return {
        player: user._id,
        rows,
    };
};

export const rollDices = (dices: Dice[]): Dice[] => {
    return dices.map(dice => {
        if (!dice.selected) dice.value = Math.floor(Math.random() * 6) + 1;

        return dice;
    });
};

const sortDices = (dices: Dice[]): Map<number, number> => {
    const sortedDices = new Map<number, number>();

    for (let i = 0; i < dices.length; i++) {
        sortedDices.set(dices[i].value, (sortedDices.get(dices[i].value) || 0) + 1);
    }

    return sortedDices;
};

export const validateScore = (dices: Dice[], rowName: ScoreboardRowName): number => {
    switch (rowName) {
        case ScoreboardRowName.Aces:
            return calculateUpperSectionRow(dices, 1);
        case ScoreboardRowName.Twos:
            return calculateUpperSectionRow(dices, 2);
        case ScoreboardRowName.Threes:
            return calculateUpperSectionRow(dices, 3);
        case ScoreboardRowName.Fours:
            return calculateUpperSectionRow(dices, 4);
        case ScoreboardRowName.Fives:
            return calculateUpperSectionRow(dices, 5);
        case ScoreboardRowName.Sixes:
            return calculateUpperSectionRow(dices, 6);
        case ScoreboardRowName.Pair:
            return calculatePair(dices);
        case ScoreboardRowName.TwoPairs:
            return calculateTwoPairs(dices);
        case ScoreboardRowName.ThreeOfKind:
            return calculateThreeOfAKind(dices);
        case ScoreboardRowName.FourOfKind:
            return calculateFourOfAKind(dices);
        case ScoreboardRowName.SmallStraight:
            return calculateSmallStraight(dices);
        case ScoreboardRowName.LargeStraight:
            return calculateLargeStraight(dices);
        case ScoreboardRowName.Fullhouse:
            return calculateFullHouse(dices);
        case ScoreboardRowName.Chance:
            return calculateChance(dices);
        case ScoreboardRowName.Yatzy:
            return calculateYatzy(dices);
        default:
            return 0;
    }
};

const calculateUpperSectionRow = (dices: Dice[], diceValue: number): number => {
    const groupedDiceValue = sortDices(dices);

    return (groupedDiceValue.get(diceValue) || 0) * diceValue;
};

const calculatePair = (dices: Dice[]): number => {
    const groupedDiceValue = sortDices(dices);
    let pair = 0;

    groupedDiceValue.forEach((value, key) => {
        if (value >= 2 && key * 2 > pair) {
            pair = key * 2;
        }
    });

    return pair;
};

const calculateTwoPairs = (dices: Dice[]): number => {
    const groupedDiceValue = sortDices(dices);
    let twoPairs = 0;

    if (groupedDiceValue.size >= 2 && groupedDiceValue.size <= 3) {
        groupedDiceValue.forEach((value, key) => {
            if (value >= 2 && value < 4) {
                twoPairs += key * 2;
            }
        });
    }

    return twoPairs;
};

const calculateThreeOfAKind = (dices: Dice[]): number => {
    const groupedDiceValue = sortDices(dices);
    let threeOfAKind = 0;
    
    groupedDiceValue.forEach((value, key) => {
        if (value >= 3) {
            threeOfAKind = key * 3;
        }
    });

    return threeOfAKind;
};

const calculateFourOfAKind = (dices: Dice[]): number => {
    const groupedDiceValue = sortDices(dices);
    let fourOfAKind = 0;
    
    groupedDiceValue.forEach((value, key) => {
        if (value >= 4) {
            fourOfAKind = key * 4;
        }
    });

    return fourOfAKind;
};

const calculateSmallStraight = (dices: Dice[]): number => {
    const groupedDiceValue = sortDices(dices);

    if (groupedDiceValue.size === 5 && groupedDiceValue.get(1) && !groupedDiceValue.get(6)) {
        return 15;
    }

    return 0;
};

const calculateLargeStraight = (dices: Dice[]): number => {
    const groupedDiceValue = sortDices(dices);

    if (groupedDiceValue.size === 5 && groupedDiceValue.get(6) && !groupedDiceValue.get(1)) {
        return 20;
    }

    return 0;
};

const calculateFullHouse = (dices: Dice[]): number => {
    const groupedDiceValue = sortDices(dices);
    let fullHouse = 0;

    if (groupedDiceValue.size === 2) {
        groupedDiceValue.forEach((value, key) => {
            if (value >=2 && value <= 3) {
                fullHouse += value * key;
            }
        });
    }

    return fullHouse;
};

const calculateChance = (dices: Dice[]): number => {
    let chance = 0;

    dices.forEach(dice => {
        chance += dice.value;
    });

    return chance;
};

const calculateYatzy = (dices: Dice[]): number => {
    const groupedDiceValue = sortDices(dices);

    if (groupedDiceValue.size === 1) {
        return 50;
    }

    return 0;
};

export const calculateSum = (scoreboardRows: ScoreboardRow[]): number | undefined => {
    let sum = 0;

    if (scoreboardRows.find(row => !row.filled)) {
        return;
    }

    scoreboardRows.forEach(row => {
        sum += row.score;
    });

    return sum;
}; 

export const calculateTotal = (scoreboardRows: ScoreboardRow[]): number | undefined => {
    let total = 0;

    if (scoreboardRows.find(row => !row.filled)) {
        return;
    }

    scoreboardRows.forEach(row => {
        total += row.score;
    });

    return total;
};

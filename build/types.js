"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameStatus = exports.ScoreboardRowName = void 0;
var ScoreboardRowName;
(function (ScoreboardRowName) {
    ScoreboardRowName["Aces"] = "Aces";
    ScoreboardRowName["Twos"] = "Twos";
    ScoreboardRowName["Threes"] = "Threes";
    ScoreboardRowName["Fours"] = "Fours";
    ScoreboardRowName["Fives"] = "Fives";
    ScoreboardRowName["Sixes"] = "Sixes";
    ScoreboardRowName["Sum"] = "Sum";
    ScoreboardRowName["Bonus"] = "Bonus";
    ScoreboardRowName["Pair"] = "Pair";
    ScoreboardRowName["TwoPairs"] = "TwoPairs";
    ScoreboardRowName["ThreeOfKind"] = "ThreeOfAKind";
    ScoreboardRowName["FourOfKind"] = "FourOfAKind";
    ScoreboardRowName["SmallStraight"] = "SmallStraight";
    ScoreboardRowName["LargeStraight"] = "LargeStraight";
    ScoreboardRowName["Fullhouse"] = "FullHouse";
    ScoreboardRowName["Chance"] = "Chance";
    ScoreboardRowName["Yatzy"] = "Yatzy";
    ScoreboardRowName["Total"] = "Total";
})(ScoreboardRowName = exports.ScoreboardRowName || (exports.ScoreboardRowName = {}));
var GameStatus;
(function (GameStatus) {
    GameStatus["Created"] = "created";
    GameStatus["Started"] = "started";
    GameStatus["Ended"] = "ended";
})(GameStatus = exports.GameStatus || (exports.GameStatus = {}));

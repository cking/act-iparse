"use strict"

const {jobs} = require("../../util")
// TODO: shorten skill names

exports.jobAbbrToLong = function (abbr) {
    return jobs[abbr] || abbr
}

exports.iconFromCombatant = function (abbr) {
    const pet = abbr.match(/^(.*) \((\S+ \S+)\)$/)
    if (!pet) return abbr
    
    if (pet[1] == "selene" || pet[1] == "eos") return pet[1]

    if (pet[1].match(/(carbuncle|karfunkel)$/)) {
        return "pet"
    }

    const egi = pet[1].match(/^([^-]+)-egi$/)
    if (egi) return egi[1]

    const copter = pet[1].match(/^(\S+) autoturret$/) || pet[1].match(/^selbstschuss-gyrocopter (.+)$/)
    if (copter) {
        if (copter[1] == "rook" || copter[1] == "läufer") return "rook"
        return "bishop"
    }

    return "chocobo"
}

exports.nerdRound = function (num) {
    if (num >= 1000000) {
        return (Math.round(num / 100000) / 10) + "m"
    } else if (num >= 1000) {
        return (Math.round(num / 100) / 10) + "k"
    } else return num
}
"use strict"

exports.jobs = {
    acn: "Arcanist", sch: "Scholar", smn: "Summoner",
    arc: "Archer", brd: "Bard",
    ast: "Astrologian",
    cnj: "Conjourer", whm: "White Mage",
    drk: "Dark Knight",
    gld: "Gladiator", pld: "Paladin",
    lnc: "Lancer", drg: "Dragoon",
    mch: "Machinist",
    mrd: "Marodeur", war: "Warrior",
    pgl: "Pugilist", mnk: "Monk",
    rog: "Rogue", nin: "Ninja",
    thm: "Thaumaturge", blm: "Black Mage",
    rdm: "Red Mage",
    sam: "Samurai",
}

exports.jobType = {
    gld: "tank", pld: "tank",
    mrd: "tank", war: "tank",
    drk: "tank",

    sch: "heal", ast: "heal",
    cnj: "heal", whm: "heal",

    acn: "mage", smn: "mage",
    thm: "mage", blm: "mage",
    rdm: "mage",

    arc: "range", brd: "range",
    mch: "range",

    pgl: "melee", mnk: "melee",
    lnc: "melee", drg: "melee",
    rog: "melee", nin: "melee",
    sam: "melee",
}

exports.jobClass = {
    gld: "pld",
    mrd: "war",
    lnc: "drg",
    cnj: "whm",
    acn: "smn",
    thm: "blm",
    arc: "brd",
    rog: "nin",
    pgl: "mnk"
}

exports.getPetType = function (name) {
    const pet = name.match(/^(.*) \((\S+ \S+)\)$/)
    if (!pet) return name.toLowerCase() == "limit break" ? "lb" : ""

    if (pet[1] == "selene" || pet[1] == "eos") return "fairy"

    if (pet[1].match(/(carbuncle|karfunkel|-egi)$/)) return "egi"
    if (pet[1].match(/^(\S+) autoturret$/) || pet[1].match(/^selbstschuss-gyrocopter (.+)$/)) return "turret"
    return "choco"
}
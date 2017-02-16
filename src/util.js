export function queryClosestSelector(el, selector) {
    for (; el && el !== document; el = el.parentNode) {
        if (el.matches(selector)) return el
    }

    return null
}

export function jsonParseDefault(str, def) {
    if (str === null) return def

    try {
        return JSON.parse(str)
    } catch (ex) {
        return def
    }
}

export function arrayToObject(arr, key, val) {
    const o = {}
    arr.forEach(item => {
        if (val === undefined) {
            const val = Object.assign({}, item)
            delete val[key]
            o[item[key]] = val
        } else {
            o[item[key]] = item[val]
        }
    })

    return o
}

export function arrayMove(arr, from, to) {
    arr.splice(to, 0, arr.splice(from, 1)[0])
}

export const Jobs = {
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
}

export function jobAbbrToLong(abbr) {
    if (Jobs[abbr]) {
        return Jobs[abbr]
    }

    return abbr
}

export function shortenSkill(name) {
    switch (name) {
        case "Rage Of Halone": return "Halone"
        default: return name
    }
}

export function hash(str) {
    var hash = 0;
    if (str.length == 0)
        return hash;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash; // Convert to 32bit integer
    }

    return hash
}

export function jobType(job, split) {
    switch (job.toLowerCase()) {
        case "": return ""

        case "gld": case "pld":
        case "mrd": case "war":
        case "drk": return "tank"

        case "sch": case "ast":
        case "cnj": case "whm":
            return "heal"

        case "acn": case "smn":
        case "thm": case "blm":
            return split ? "mage" : "dd"

        case "arc": case "brd":
        case "mch": return split ? "range" : "dd"

        default: return split ? "melee" : "dd"
    }
}

export function classToJob(job) {
    switch (job.toLowerCase()) {
        case "gld": return "pld"
        case "mrd": return "war"
        case "cnj":return "whm"
        case "acn": return "smn"
        case "thm": return "blm"
        case "arc": return "brd"
        default: return job.toLowerCase()
    }
}

export function iconFromCombatant(abbr) {
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
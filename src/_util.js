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

export function shortenSkill(name) {
    switch (name) {
        case "Rage Of Halone": return "Halone"
        default: return name
    }
}
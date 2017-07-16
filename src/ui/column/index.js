"use strict"

exports.style = function (cell) {
    const def = exports[cell.id]

    if (!def) {
        console.error(`failed to fetch style for type <${cell.id}>`)
        return false
    }

    if (typeof def.style === "function") {
        return { style: def.style(cell) }
    }

    return { style: def.style || "" }
}

exports.render = function (out, args) {
    const def = exports[args.cell.id]

    if (!def) {
        console.log(args.cell.id, args)
        console.error(`failed to render column for type <${args.cell.id}>`)
        return false
    }
    return def.render(out, args)
}

const general = require("./general")
Object.keys(general).forEach(k => exports[k] = general[k])

const dd = require("./dd")
Object.keys(dd).forEach(k => exports[k] = dd[k])

const heal = require("./heal")
Object.keys(heal).forEach(k => exports[k] = heal[k])

const tank = require("./tank")
Object.keys(tank).forEach(k => exports[k] = tank[k])

const legacy = require("./legacy")
Object.keys(legacy).forEach(k => exports[k] = legacy[k])
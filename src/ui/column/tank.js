"use strict"

const { nerdRound } = require("./util")

exports.tdps = {
    name: "TDPS",
    description: "Display the damage taken per second",
    enabled: false,
    options: [
        {
            name: "Align",
            description: "Text align in the cell",
            default: "fr",
            type: "option",
            values: { fl: "Left", fc: "Center", fr: "Right" }
        }, {
            name: "Monospaced",
            description: "Use a monospaced, fixed-width font",
            default: true,
            type: "checkbox"
        }
    ],
    style: "width: 4rem",
    render(out, args) {
        if (args.cell.opts.monospace) {
            out.beginElement("span", { "class": "mono" })
        }

        out.text(parseInt(+args.combatant.damagetaken / +args.combatant.DURATION) || 0)

        if (args.cell.opts.monospace) {
            out.endElement()
        }
    }
}

exports.taken = {
    name: "Damage Taken",
    description: "Display the damage taken",
    enabled: false,
    options: {
        align: {
            name: "Align",
            description: "Text align in the cell",
            default: "fr",
            type: "option",
            values: { fl: "Left", fc: "Center", fr: "Right" }
        }, 
        monospace: {
            name: "Monospaced",
            description: "Use a monospaced, fixed-width font",
            default: true,
            type: "checkbox"
        }, 
        style: {
            name: "Style",
            description: "Change display style",
            default: "percentage",
            type: "select",
            values: { short: "Short (5k)", long: "Long (5000)", percentage: "Percantage (5%)" }
        }
    },
    style(cell) {
        if (cell.opts.style !== "percentage") {
            return "width: 7rem";
        } else {
            return "width: 4rem";
        }
    },
    render(out, args) {
        if (args.cell.opts.monospace) {
            out.beginElement("span", { "class": "mono" })
        }

        let value = +args.combatant.damagetaken
        if (args.cell.opts.style == "short") value = nerdRound(value)
        else if (args.cell.opts.style == "percentage") value = parseInt(+args.combatant.damagetaken / +args.encounter.damagetaken * 100) + "%"

        out.text(value)

        if (args.cell.opts.monospace) {
            out.endElement()
        }
    }
} 

exports.rhps = {
    name: "Received HPS",
    description: "Display the received heal per second",
    enabled: false,
    options: {
        align: {
            name: "Align",
            description: "Text align in the cell",
            default: "fr",
            type: "option",
            values: { fl: "Left", fc: "Center", fr: "Right" }
        }, 
        monospace: {
            name: "Monospaced",
            description: "Use a monospaced, fixed-width font",
            default: true,
            type: "checkbox"
        }
    },
    style: "width: 4rem",
    render(out, args) {
        if (args.cell.opts.monospace) {
            out.beginElement("span", { "class": "mono" })
        }

        out.text(parseInt(+args.combatant.healstaken / +args.combatant.DURATION) || 0)

        if (args.cell.opts.monospace) {
            out.endElement()
        }
    }
}

exports.received = {
    name: "Heals Received",
    description: "Display the health restored",
    enabled: false,
    options: {
        align: {
            name: "Align",
            description: "Text align in the cell",
            default: "fr",
            type: "option",
            values: { fl: "Left", fc: "Center", fr: "Right" }
        }, 
        monospace: {
            name: "Monospaced",
            description: "Use a monospaced, fixed-width font",
            default: true,
            type: "checkbox"
        }, 
        style: {
            name: "Style",
            description: "Change display style",
            default: "percentage",
            type: "select",
            values: { short: "Short (5k)", long: "Long (5000)", percentage: "Percantage (5%)" }
        }
    },
    style(cell) {
        if (cell.opts.style !== "percentage") {
            return "width: 7rem";
        } else {
            return "width: 4rem";
        }
    },
    render(out, args) {
        if (args.cell.opts.monospace) {
            out.beginElement("span", { "class": "mono" })
        }

        let value = +args.combatant.healstaken
        if (args.cell.opts.style == "short") value = nerdRound(value)
        else if (args.cell.opts.style == "percentage") value = parseInt(+args.combatant.healstaken / +args.encounter.healstaken * 100) + "%"

        out.text(value)

        if (args.cell.opts.monospace) {
            out.endElement()
        }
    }
} 

exports.parry = {
    name: "Parry",
    description: "Display the parry rate",
    enabled: false,
    options: {
        align: {
            name: "Align",
            description: "Text align in the cell",
            default: "fr",
            type: "option",
            values: { fl: "Left", fc: "Center", fr: "Right" }
        }, 
        monospace: {
            name: "Monospaced",
            description: "Use a monospaced, fixed-width font",
            default: true,
            type: "checkbox"
        }
    },
    style: "width: 4rem",
    render(out, args) {
        if (args.cell.opts.monospace) {
            out.beginElement("span", { "class": "mono" })
        }

        out.text(args.combatant.ParryPct)

        if (args.cell.opts.monospace) {
            out.endElement()
        }
    }
}

exports.block = {
    name: "Block",
    description: "Display the block rate",
    enabled: false,
    options: {
        align: {
            name: "Align",
            description: "Text align in the cell",
            default: "fr",
            type: "option",
            values: { fl: "Left", fc: "Center", fr: "Right" }
        }, 
        monospace: {
            name: "Monospaced",
            description: "Use a monospaced, fixed-width font",
            default: true,
            type: "checkbox"
        }
    },
    style: "width: 4rem",
    render(out, args) {
        if (args.cell.opts.monospace) {
            out.beginElement("span", { "class": "mono" })
        }

        out.text(args.combatant.BlockPct)

        if (args.cell.opts.monospace) {
            out.endElement()
        }
    }
}
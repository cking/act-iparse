"use strict"

const { nerdRound } = require("./util")

exports.dps = {
    name: "DPS",
    description: "Display the damage per second",
    enabled: true,
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

        out.text(args.combatant.ENCDPS)

        if (args.cell.opts.monospace) {
            out.endElement()
        }
    }
}

exports.damage = {
    name: "Damage",
    description: "Display the absolute damage done",
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
            default: "short",
            type: "select",
            values: { short: "Short (5k)", long: "Long (5000)", percentage: "Percantage (5%)" }
        }
    },
    style(cell) {
        if (cell.opts.style === "long") return "width: 7rem"
        return "width: 4rem";
    },
    render(out, args) {
        if (args.cell.opts.monospace) {
            out.beginElement("span", { "class": "mono" })
        }

        let value = +args.combatant.damage
        if (args.cell.opts.style == "short") value = nerdRound(value)
        else if (args.cell.opts.style == "percentage") value = args.combatant["damage%"]

        out.text(value)

        if (args.cell.opts.monospace) {
            out.endElement()
        }
    }
}

exports.maxhit = {
    name: "Best Hit",
    description: "Display the strongest attack",
    enabled: false,
    options: {
        align: {
            description: "Text align in the cell",
            default: "fl",
            type: "option",
            values: { fl: "Left", fc: "Center", fr: "Right" }
        }, 
        style: {
            name: "Style",
            description: "Change display style",
            default: "both",
            type: "select",
            values: { both: "Skill and Damage", skill: "Skill", damage: "Damage" }
        }, 
        round: {
            name: "Round",
            description: "Prefer shortened values (5k) over long values (5000)",
            default: true,
            type: "checkbox",
        }
    },
    style(cell) {
        if (cell.opts.style == "damage") {
            return cell.opts.round ? "width: 4rem" : "width: 5rem"
        }

        return "width: 12rem"
    },
    render: (out, args) => {
        let [skill, dottedDamage] = args.combatant.maxhit.split("-")

        if (!skill) return
        if (skill.length > 15) {
            skill = skill.substr(0, 14) + "..."
        }

        let damage = (dottedDamage || "0").replace(/\./g, "")
        if (args.cell.opts.round) {
            damage = nerdRound(damage)
        }

        switch (args.cell.opts.style) {
            case "damage": return out.text(damage)
            case "skill": return out.text(skill)
            case "both": return out.text(`${skill} (${damage})`)
        }
    }
}

exports.crithit = {
    name: "Critical Hits",
    description: "Display the critical hit rate",
    enabled: true,
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
        format: {
            name: "Format",
            description: "Display style of the crit rate",
            default: "rel",
            type: "option",
            values: { rel: "In Percent", abs: "Absolute number of hits" }
        }
    },
    style: "width: 4rem",
    render: (out, args) => {
        if (args.cell.opts.monospace) {
            out.beginElement("span", { "class": "mono" })
        }

        if (args.cell.opts.format === "abs") {
            out.text(args.combatant.crithits)
        } else {
            out.text(args.combatant["crithit%"])
        }

        if (args.cell.opts.monospace) {
            out.endElement()
        }
    }
}

exports.directhit = {
    name: "Direct Hits",
    description: "Display the direct hit rate",
    enabled: true,
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
        format: {
            name: "Format",
            description: "Display style of the crit rate",
            default: "rel",
            type: "option",
            values: { rel: "In Percent", abs: "Absolute number of hits" }
        }
    },
    style: "width: 4rem",
    render: (out, args) => {
        if (args.cell.opts.monospace) {
            out.beginElement("span", { "class": "mono" })
        }

        if (args.cell.opts.format === "abs") {
            out.text(args.combatant.DirectHitCount)
        } else {
            out.text(args.combatant.DirectHitPct)
        }

        if (args.cell.opts.monospace) {
            out.endElement()
        }
    }
}

exports.critdirecthit = {
    name: "Crititcal Direct Hits",
    description: "Display the ciritcal direct hit rate",
    enabled: true,
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
        format: {
            name: "Format",
            description: "Display style of the crit rate",
            default: "rel",
            type: "option",
            values: { rel: "In Percent", abs: "Absolute number of hits" }
        }
    },
    style: "width: 4rem",
    render: (out, args) => {
        if (args.cell.opts.monospace) {
            out.beginElement("span", { "class": "mono" })
        }

        if (args.cell.opts.format === "abs") {
            out.text(args.combatant.CritDirectHitCount)
        } else {
            out.text(parseInt(args.combatant.CritDirectHitCount / args.combatant.swings * 100))
        }

        if (args.cell.opts.monospace) {
            out.endElement()
        }
    }
}
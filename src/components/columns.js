import h from 'inferno-create-element'
import { arrayToObject, jobAbbrToLong, shortenSkill } from "../util"
import normat from "normat"
const si = normat([
    ["", 1000], ["k", 1000], ["m"]
])

//-- MISC

export const IndexColumn = {
    key: "position",
    name: "Position",
    description: "Display the position in the ranking",
    options: [
        {
            key: "title",
            name: "Title",
            description: "The column title",
            default: "",
            type: "text",
        }, {
            key: "align",
            name: "Align",
            description: "Text align in the cell",
            default: "fr",
            type: "option",
            values: { fl: "Left", fc: "Center", fr: "Right" }
        }
    ],
    enabled: "true",
    renderHeader: opts => (<div className={"ftiny " + opts.align}>{opts.title}</div>),
    renderCell: (index, props, opts) => <div className={"ftiny " + opts.align}>{(index + 1) + "."}</div>
}

export const NameColumn = {
    key: "name",
    name: "Name",
    description: "Display the character name",
    options: [
        {
            key: "title",
            name: "Title",
            description: "The column title",
            default: "Name",
            type: "text",
        }, {
            key: "align",
            name: "Align",
            description: "Text align in the cell",
            default: "fl",
            type: "option",
            values: { fl: "Left", fc: "Center", fr: "Right" }
        }, {
            key: "abbr",
            name: "Abbreviation",
            description: "Abbreviate the first name, last name, or both",
            default: "",
            type: "select",
            values: { "": "First Last", "first": "F. Last", "last": "First L.", "both": "F. L." }
        }
    ],
    enabled: "true",
    renderHeader: opts => <div className={ opts.align }>{opts.title}</div>,
    renderCell: (index, props, opts) => {
        const name = props.name.split(" ")
        switch (opts.abbr) {
            case "first": name[0] = name[0][0] + "."; break
            case "last": name[1] = name[1][0] + "."; break
            case "both":
                name[0] = name[0][0] + "."
                name[1] = name[1][0] + "."
        }
        return <div className={ opts.align }>{name[0]} {name[1]}</div>
    }
}

export const DeathColumn = {
    key: "death",
    name: "Deaths",
    description: "Display player deaths",
    options: [
        {
            key: "title",
            name: "Title",
            description: "The column title",
            default: "†",
            type: "text",
        }, {
            key: "align",
            name: "Align",
            description: "Text align in the cell",
            default: "center",
            type: "option",
            values: { fl: "Left", fc: "Center", fr: "Right" }
        }
        // TODO round value?
    ],
    enabled: "false",
    renderHeader: opts => (<div className={"ftiny " + opts.align}>{opts.title}</div>),
    renderCell: (index, props, opts) => <div className={"ftiny " + opts.align}>{props.deaths}</div>
}

export const JobColumn = {
    key: "job",
    name: "Job",
    description: "Display the characters Job",
    options: [
        {
            key: "title",
            name: "Title",
            description: "The column title",
            default: "",
            type: "text",
        }, {
            key: "align",
            name: "Align",
            description: "Text align in the cell",
            default: "fl",
            type: "option",
            values: { fl: "Left", fc: "Center", fr: "Right" }
        }, {
            key: "icon",
            name: "Display Icon",
            description: "Display the class or job as an icon",
            default: true,
            type: "checkbox"
        }, {
            key: "format",
            name: "Format",
            description: "Job/Class name",
            default: "",
            type: "select",
            values: { "": "Hidden", "short": "3 Char Abbreviation", "long": "Full Class Name" }
        }
    ],
    enabled: "true",
    renderHeader: opts => {
        let iw = opts.icon ? 2 : 0
        switch (opts.format) {
            case "short": iw += 3; return
            case "long": iw += 5; return
        }

        return (<div className={opts.align} style={{flex: "0 " + iw + "em"}}>{opts.title}</div>)
    },
    renderCell: (index, props, opts) => {
        const abbr = (props.Job || props.name).toLowerCase()
        const icon = !opts.icon ? "" : <img src={"icons/" + abbr.replace(/\s+/g, "") + ".png"} style={{
            height: "1.5rem", width: "auto", position: "absolute", marginTop: "-0.15em"
        }} />

        let job = ""
        if (opts.format == "short") {
            job = props.Job.toUpperCase()
        } else if (opts.format == "long") {
            job = jobAbbrToLong(props.Job.toLowerCase())
        }

        if (opts.format != "") {
            job = <span style={{ paddingLeft: opts.icon ? "1.7em" : "inherit" }}>{job}</span>
        }

        let iw = opts.icon ? 2 : 0
        switch (opts.format) {
            case "short": iw += 3; return
            case "long": iw += 5; return
        }

        return <div className={opts.align} style={{flex: "0 " + iw + "em"}}>{icon} {job}</div>
    }
}

export const AccuracyColumn = {
    key: "accuracy",
    name: "Accuracy",
    description: "Display the relative accuracy",
    options: [
        {
            key: "title",
            name: "Title",
            description: "The column title",
            default: "Accuracy",
            type: "text",
        }, {
            key: "align",
            name: "Align",
            description: "Text align in the cell",
            default: "fl",
            type: "option",
            values: { fl: "Left", fc: "Center", fr: "Right" }
        }, {
            key: "monospace",
            name: "Monospaced",
            description: "Use a monospaced, fixed-width font",
            default: true,
            type: "checkbox"
        }, {
            key: "reverse",
            name: "Missrate",
            description: "Instead of displaying the accuracy, display the rate of misses",
            default: false,
            type: "checkbox"
        }
    ],
    enabled: "false",
    renderHeader: opts => <div className={"fmedi " + opts.align}>{opts.title}</div>,
    renderCell: (index, props, opts) => <div className={"fmedi " + opts.align + (opts.monospace ? " mono" : "")}>
        {!opts.reverse ? (+props.TOHIT || 100) + "%" : parseInt(100 - parseFloat((+props.TOHIT ? props.tohit : "100").replace(",", "."))) + "%"}
    </div>
}

export const MissNumColumn = {
    key: "miss",
    name: "Number of misses",
    description: "Display the number of misses",
    options: [
        {
            key: "title",
            name: "Title",
            description: "The column title",
            default: "Misses",
            type: "text",
        }, {
            key: "align",
            name: "Align",
            description: "Text align in the cell",
            default: "fr",
            type: "option",
            values: { fl: "Left", fc: "Center", fr: "Right" }
        }, {
            key: "monospace",
            name: "Monospaced",
            description: "Use a monospaced, fixed-width font",
            default: true,
            type: "checkbox"
        }
    ],
    enabled: "false",
    renderHeader: opts => <div className={"fsmol " + opts.align}>{opts.title}</div>,
    renderCell: (index, props, opts) => <div className={"fsmol " + opts.align + (opts.monospace ? " mono" : "")}>{props.misses}</div>
}

//-- DD

export const DPSColumn = {
    key: "dps",
    name: "DPS",
    description: "Display the damage per second",
    options: [
        {
            key: "title",
            name: "Title",
            description: "The column title",
            default: "DPS",
            type: "text",
        }, {
            key: "align",
            name: "Align",
            description: "Text align in the cell",
            default: "fr",
            type: "option",
            values: { fl: "Left", fc: "Center", fr: "Right" }
        }, {
            key: "monospace",
            name: "Monospaced",
            description: "Use a monospaced, fixed-width font",
            default: true,
            type: "checkbox"
        }
    ],
    enabled: "true",
    renderHeader: opts => <div className={"fmedi " + opts.align}>{opts.title}</div>,
    renderCell: (index, props, opts) => <div className={"fmedi " + opts.align + (opts.monospace ? " mono" : "")}>{props.ENCDPS}</div>
}

export const DamageColumn = {
    key: "damage",
    name: "Damage",
    description: "Display the absolute damage done",
    options: [
        {
            key: "title",
            name: "Title",
            description: "The column title",
            default: "Dmg",
            type: "text",
        }, {
            key: "align",
            name: "Align",
            description: "Text align in the cell",
            default: "fr",
            type: "option",
            values: { fl: "Left", fc: "Center", fr: "Right" }
        }, {
            key: "monospace",
            name: "Monospaced",
            description: "Use a monospaced, fixed-width font",
            default: true,
            type: "checkbox"
        }, {
            key: "style",
            name: "Style",
            description: "Change display style",
            default: "short",
            type: "select",
            values: { short: "Short (5k)", long: "Long (5000)", percentage: "Percantage (5%)" }
        }
    ],
    enabled: "false",
    renderHeader: opts => <div class={(opts.style == "long"? "flong ": "fmedi ") + opts.align}>{opts.title}</div>,
    renderCell: (index, props, opts) => {
        let value = +props.damage
        if (opts.style == "short") value = si(value)
        else if (opts.style == "percentage") value = props["damage%"]

        return <div className={(opts.style == "long"? "flong ": "fmedi ") + opts.align + (opts.monospace ? " mono" : "")}>
            {value}
        </div>
    }
}

export const MaxHitColumn = {
    key: "maxhit",
    name: "Best Hit",
    description: "Display the strongest attack",
    options: [
        {
            key: "title",
            name: "Title",
            description: "The column title",
            default: "Best Hit",
            type: "text",
        }, {
            key: "align",
            name: "Align",
            description: "Text align in the cell",
            default: "fl",
            type: "option",
            values: { fl: "Left", fc: "Center", fr: "Right" }
        }, {
            key: "style",
            name: "Style",
            description: "Change display style",
            default: "both",
            type: "select",
            values: { both: "Skill and Damage", skill: "Skill", damage: "Damage" }
        }, {
            key: "round",
            name: "Round",
            description: "Prefer shortened values (5k) over long values (5000)",
            default: true,
            type: "checkbox",
        }
    ],
    enabled: "false",
    renderHeader: opts => <div className={"fhuge " + opts.align}>{opts.title}</div>,
    renderCell: (index, props, opts) => {
        const [skill, dottedDamage] = props.maxhit.split("-")
        const damage = (dottedDamage || "0").replace(/\./g, "")
        let amount = ""
        if (opts.style == "damage") amount = opts.round ? si(+damage) : damage
        else if (skill != "" && opts.style == "both") amount = "(" + (opts.round ? si(+damage) : damage) + ")"
        return <div className={"fhuge " + opts.align + (opts.monospace ? " mono" : "")}>{opts.style != "damage" ? shortenSkill(skill) : ""} {amount}</div>
    }
}

export const CritHitColumn = {
    key: "crithit",
    name: "Critical Hits",
    description: "Display the critical hit rate",
    options: [
        {
            key: "title",
            name: "Title",
            description: "The column title",
            default: "Crit Hit",
            type: "text",
        }, {
            key: "align",
            name: "Align",
            description: "Text align in the cell",
            default: "fr",
            type: "option",
            values: { fl: "Left", fc: "Center", fr: "Right" }
        }, {
            key: "monospace",
            name: "Monospaced",
            description: "Use a monospaced, fixed-width font",
            default: true,
            type: "checkbox"
        }, {
            key: "format",
            name: "Format",
            description: "Display style of the crit rate",
            default: true,
            type: "option",
            values: { rel: "In Percent", abs: "Absolute number of hits" }
        }
    ],
    enabled: "false",
    renderHeader: opts => <div className={"fmedi " + opts.align}>{opts.title}</div>,
    renderCell: (index, props, opts) => {
        return (<div className={"fmedi " + opts.align + (opts.monospace ? " mono" : "")}>
            {opts.format == "rel" ? props["crithit%"] : props.crithits}
        </div>)
    }
}

//-- HEAL

export const HPSColumn = {
    key: "hps",
    name: "HPS",
    description: "Display the heal per second",
    options: [
        {
            key: "title",
            name: "Title",
            description: "The column title",
            default: "HPS",
            type: "text",
        }, {
            key: "align",
            name: "Align",
            description: "Text align in the cell",
            default: "fr",
            type: "option",
            values: { fl: "Left", fc: "Center", fr: "Right" }
        }, {
            key: "monospace",
            name: "Monospaced",
            description: "Use a monospaced, fixed-width font",
            default: true,
            type: "checkbox"
        }
        // TODO highlight low, mid, high?
    ],
    enabled: "true",
    renderHeader: opts => <div className={"fmedi " + opts.align}>{opts.title}</div>,
    renderCell: (index, props, opts) => <div className={"fmedi " + opts.align + (opts.monospace ? " mono" : "")}>{props.ENCHPS}</div>
}

export const HealColumn = {
    key: "heal",
    name: "Heal",
    description: "Display the absolute healing done",
    options: [
        {
            key: "title",
            name: "Title",
            description: "The column title",
            default: "Heal",
            type: "text",
        }, {
            key: "align",
            name: "Align",
            description: "Text align in the cell",
            default: "fr",
            type: "option",
            values: { fl: "Left", fc: "Center", fr: "Right" }
        }, {
            key: "monospace",
            name: "Monospaced",
            description: "Use a monospaced, fixed-width font",
            default: true,
            type: "checkbox"
        }, {
            key: "style",
            name: "Style",
            description: "Change display style",
            default: "short",
            type: "select",
            values: { short: "Short (5k)", long: "Long (5000)", percentage: "Percantage (5%)" }
        }
    ],
    enabled: "false",
    renderHeader: opts => <div class={(opts.style == "long"? "flong ": "fmedi ") + opts.align}>{opts.title}</div>,
    renderCell: (index, props, opts) => {
        let value = +props.healed
        if (opts.style == "short") value = si(value)
        else if (opts.style == "percentage") value = props["healed%"]

        return <div className={(opts.style == "long"? "flong ": "fmedi ") + opts.align + (opts.monospace ? " mono" : "")}>
            {value}
        </div>
    }
}

export const OverhealColumn = {
    key: "oh",
    name: "Overheal",
    description: "Display the relative overheal done",
    options: [
        {
            key: "title",
            name: "Title",
            description: "The column title",
            default: "OH",
            type: "text",
        }, {
            key: "align",
            name: "Align",
            description: "Text align in the cell",
            default: "fr",
            type: "option",
            values: { fl: "Left", fc: "Center", fr: "Right" }
        }, {
            key: "monospace",
            name: "Monospaced",
            description: "Use a monospaced, fixed-width font",
            default: true,
            type: "checkbox"
        }
    ],
    enabled: "false",
    renderHeader: opts => <div className={"fsmol " + opts.align}>{opts.title}</div>,
    renderCell: (index, props, opts) => <div className={"fsmol " + opts.align + (opts.monospace ? " mono" : "")}>{props.OverHealPct}</div>
}

export const MaxHealColumn = {
    key: "maxheal",
    name: "Best Heal",
    description: "Display the strongest heal",
    options: [
        {
            key: "title",
            name: "title",
            description: "The column title",
            default: "Best Heal",
            type: "text",
        }, {
            key: "align",
            name: "Align",
            description: "Text align in the cell",
            default: "fl",
            type: "option",
            values: { fl: "Left", fc: "Center", fr: "Right" }
        }, {
            key: "style",
            name: "Style",
            description: "Change display style",
            default: "both",
            type: "select",
            values: { both: "Skill and Heal", skill: "Skill", heal: "Heal" }
        }, {
            key: "round",
            name: "Round",
            description: "Prefer shortened values (5k) over long values (5000)",
            default: true,
            type: "checkbox",
        }
    ],
    enabled: "false",
    renderHeader: opts => <div className={"fhuge " + opts.align}>{opts.title}</div>,
    renderCell: (index, props, opts) => {
        const [skill, dottedHeal] = props.maxheal.split("-")
        const heal = (dottedHeal || "0").replace(/\./g, "")

        let amount = ""
        if (opts.style == "heal") amount = opts.round ? si(+heal) : heal
        else if (skill != "" && opts.style == "both") amount = "(" + (opts.round ? si(+heal) : heal) + ")"

        return <div className={"fhuge " + opts.align + (opts.monospace ? " mono" : "")}>{opts.style != "heal" ? shortenSkill(skill) : ""} {amount}</div>
    }
}

export const CritHealColumn = {
    key: "critheal",
    name: "Critical Heals",
    description: "Display the critical heal rate",
    options: [
        {
            key: "title",
            name: "Title",
            description: "The column title",
            default: "Crit Heal",
            type: "text",
        }, {
            key: "align",
            name: "Align",
            description: "Text align in the cell",
            default: "fr",
            type: "option",
            values: { fl: "Left", fc: "Center", fr: "Right" }
        }, {
            key: "monospace",
            name: "Monospaced",
            description: "Use a monospaced, fixed-width font",
            default: true,
            type: "checkbox"
        }, {
            key: "format",
            name: "Format",
            description: "Display style of the crit rate",
            default: true,
            type: "option",
            values: { rel: "In Percent", abs: "Absolute number of heals" }
        }
    ],
    enabled: "false",
    renderHeader: opts => <div className={"fmedi " + opts.align}>{opts.title}</div>,
    renderCell: (index, props, opts) => {
        return (<div className={"fmedi " + opts.align + (opts.monospace ? " mono" : "")}>
            {opts.format == "rel" ? props["critheal%"] : props.critheals}
        </div>)
    }
}

//-- TANK 

export const TDPSColumn = {
    key: "tdps",
    name: "Taken DPS",
    description: "Display the damage taken per second",
    options: [
        {
            key: "title",
            name: "Title",
            description: "The column title",
            default: "TDPS",
            type: "text",
        }, {
            key: "align",
            name: "Align",
            description: "Text align in the cell",
            default: "fr",
            type: "option",
            values: { fl: "Left", fc: "Center", fr: "Right" }
        }, {
            key: "monospace",
            name: "Monospaced",
            description: "Use a monospaced, fixed-width font",
            default: true,
            type: "checkbox"
        }
    ],
    enabled: "false",
    renderHeader: opts => <div className={"fsmol " + opts.align}>{opts.title}</div>,
    renderCell: (index, props, opts, enc) => (<div className={"fsmol " + opts.align + (opts.monospace ? " mono" : "")}>
        {parseInt(+props.damagetaken / +props.DURATION) || 0}
    </div>)
}

export const TakenColumn = {
    key: "taken",
    name: "Damage Taken",
    description: "Display the absolute damage taken",
    options: [
        {
            key: "title",
            name: "Title",
            description: "The column title",
            default: "Taken",
            type: "text",
        }, {
            key: "align",
            name: "Align",
            description: "Text align in the cell",
            default: "fr",
            type: "option",
            values: { fl: "Left", fc: "Center", fr: "Right" }
        }, {
            key: "monospace",
            name: "Monospaced",
            description: "Use a monospaced, fixed-width font",
            default: true,
            type: "checkbox"
        }, {
            key: "style",
            name: "Style",
            description: "Change display style",
            default: "short",
            type: "select",
            values: { short: "Short (5k)", long: "Long (5000)", percentage: "Percantage (5%)" }
        }
    ],
    enabled: "false",
    renderHeader: opts => <div class={(opts.style == "long"? "flong ": "fmedi ") + opts.align}>{opts.title}</div>,
    renderCell: (index, props, opts, enc) => {
        let value = +props.damagetaken
        if (opts.style == "short") value = si(value)
        else if (opts.style == "percentage") value = parseInt(+props.damagetaken / +enc.damagetaken * 100) + "%"

        return <div className={(opts.style == "long"? "flong ": "fmedi ") + opts.align + (opts.monospace ? " mono" : "")}>
            {value}
        </div>
    }
} 

export const RHPSColumn = {
    key: "rhps",
    name: "Received HPS",
    description: "Display the heal received per second",
    options: [
        {
            key: "title",
            name: "Title",
            description: "The column title",
            default: "RHPS",
            type: "text",
        }, {
            key: "align",
            name: "Align",
            description: "Text align in the cell",
            default: "fr",
            type: "option",
            values: { fl: "Left", fc: "Center", fr: "Right" }
        }, {
            key: "monospace",
            name: "Monospaced",
            description: "Use a monospaced, fixed-width font",
            default: true,
            type: "checkbox"
        }
    ],
    enabled: "false",
    renderHeader: opts => <div className={"fsmol " + opts.align}>{opts.title}</div>,
    renderCell: (index, props, opts, enc) => (<div className={"fsmol " + opts.align + (opts.monospace ? " mono" : "")}>
        {parseInt(+props.healstaken / +props.DURATION) || 0}
    </div>)
}

export const HealReceivedColumn = {
    key: "received",
    name: "Heals Received",
    description: "Display the received heals",
    options: [
        {
            key: "title",
            name: "Title",
            description: "The column title",
            default: "Recv",
            type: "text",
        }, {
            key: "align",
            name: "Align",
            description: "Text align in the cell",
            default: "fl",
            type: "option",
            values: { fl: "Left", fc: "Center", fr: "Right" }
        }, {
            key: "monospace",
            name: "Monospaced",
            description: "Use a monospaced, fixed-width font",
            default: true,
            type: "checkbox"
        }, {
            key: "style",
            name: "Style",
            description: "Change display style",
            default: "short",
            type: "select",
            values: { short: "Short (5k)", long: "Long (5000)", percentage: "Percantage (5%)" }
        }
    ],
    enabled: "false",
    renderHeader: opts => <div class={(opts.style == "long"? "flong ": "fmedi ") + opts.align}>{opts.title}</div>,
    renderCell: (index, props, opts, enc) => {
        let value = +props.healstaken
        if (opts.style == "short") value = si(value)
        else if (opts.style == "percentage") value = parseInt(+props.healstaken / +enc.healstaken * 100) + "%"

        return <div className={(opts.style == "long"? "flong ": "fmedi ")  + opts.align + (opts.monospace ? " mono" : "")}>
            {value}
        </div>
    }
}

export const ParryColumn = {
    key: "parry",
    name: "Parry",
    description: "Display the parry rate",
    options: [
        {
            key: "title",
            name: "Title",
            description: "The column title",
            default: "Parry",
            type: "text",
        }, {
            key: "align",
            name: "Align",
            description: "Text align in the cell",
            default: "fr",
            type: "option",
            values: { fl: "Left", fc: "Center", fr: "Right" }
        }, {
            key: "monospace",
            name: "Monospaced",
            description: "Use a monospaced, fixed-width font",
            default: true,
            type: "checkbox"
        }
    ],
    enabled: "false",
    renderHeader: opts => <div className={"fmedi " + opts.align}>{opts.title}</div>,
    renderCell: (index, props, opts) => <div className={"fmedi " + opts.align + (opts.monospace ? " mono" : "")}>{props.ParryPct}</div>
}

export const BlockColumn = {
    key: "block",
    name: "Block",
    description: "Display the block rate",
    options: [
        {
            key: "title",
            name: "Title",
            description: "The column title",
            default: "Block",
            type: "text",
        }, {
            key: "align",
            name: "Align",
            description: "Text align in the cell",
            default: "fr",
            type: "option",
            values: { fl: "Left", fc: "Center", fr: "Right" }
        }, {
            key: "monospace",
            name: "Monospaced",
            description: "Use a monospaced, fixed-width font",
            default: true,
            type: "checkbox"
        }
    ],
    enabled: "false",
    renderHeader: opts => <div className={"fmedi " + opts.align}>{opts.title}</div>,
    renderCell: (index, props, opts) => <div className={"fmedi " + opts.align + (opts.monospace ? " mono" : "")}>{props.BlockPct}</div>
}

const cells = [
    IndexColumn, NameColumn, DeathColumn, JobColumn, AccuracyColumn, MissNumColumn,
    DPSColumn, DamageColumn, MaxHitColumn, CritHitColumn,
    HPSColumn, HealColumn, OverhealColumn, MaxHealColumn, CritHealColumn,
    TDPSColumn, TakenColumn, RHPSColumn, HealReceivedColumn, ParryColumn, BlockColumn,
]
export function defaultCellSettings() {
    return cells.map(cell => ({
        id: cell.key,
        enabled: cell.enabled,
        opts: cell.options.map(opt => ({
            id: opt.key,
            value: opt.default
        }))
    }))
}

export function renderHeader(cell) {
    if (!cell.enabled) return ""
    const col = cells.find(c => c.key == cell.id)
    if (!col) return ""
    return col.renderHeader(arrayToObject(cell.opts, "id", "value"))
}

export function renderCell(cell, index, combatant, encounter) {
    if (!cell.enabled) return ""
    const col = cells.find(c => c.key == cell.id)
    if (!col) return ""
    return col.renderCell(index, combatant, arrayToObject(cell.opts, "id", "value"), encounter)
}

export default cells
import h from 'inferno-create-element'
import { Jobs, hash, jobType, classToJob } from "../util"
import Color from "color"

const classSettingsBase = [
    {
        key: "tank",
        name: "Tanks",
        default: "#364597",
        type: "color",
    },
    {
        key: "heal",
        name: "Heals",
        default: "#355b26",
        type: "color",
    },
]

function renderCellInput(type, def, val, ev) {
    const label = <label for={type + "-" + def.key}>{def.name}</label>
    const value = val ? val : def.default
    switch (def.type) {
        case "color": return <div className="pure-control-group">
            {label}
            <input id={type + "-" + def.key} name={type + "-" + def.key} value={value} type={def.type} onInput={ev} />
        </div>
    }
}

function colorSetting(key, name, defaultValue, type) {
    return { key, name, type: type || "color", default: defaultValue }
}

function colorRandom() {
    const rand = parseInt(Math.random() * 255)
    const hex = rand.toString(16)
    return hex.length == 2 ? hex : "0" + hex
}

function getDefaultValue(def, key) {
    const item = def.settings ? def.settings.find(i => i.key == key) : null
    return item ? item.default : item
}

export const colors = {
    checksum: {
        name: "By character name",
        getColor: (settings, combatant) => "hsl(" + (hash(combatant.name) + 200) % 360 + ",100%,50%)"
    },
    random: {
        name: "Random (Epilepsy warning!)",
        getColor: () => "#" + colorRandom() + colorRandom() + colorRandom()
    },
    class: {
        name: "By job type",
        title: "Job type colors",
        settings: [
            {
                key: "dd",
                name: "Damage Dealer",
                default: "#643434",
                type: "color",
            },
        ].concat(...classSettingsBase),
        getColor: (settings, combatant) => (
            settings && settings[jobType(combatant.Job)] ?
                settings[jobType(combatant.Job)] :
                getDefaultValue(colors.class, jobType(combatant.Job))
        ) || "transparent"
    },
    classex: {
        name: "By job type, DD split by type",
        title: "Job type colors",
        settings: [
            {
                key: "melee",
                name: "Melee",
                default: "#864545",
                type: "color",
            },
            {
                key: "range",
                name: "Ranged",
                default: "#643434",
                type: "color",
            },
            {
                key: "mage",
                name: "Mages",
                default: "#64344c",
                type: "color",
            },
        ].concat(...classSettingsBase),
        getColor: (settings, combatant) => (
            settings && settings[jobType(combatant.Job, true)] ?
                settings[jobType(combatant.Job, true)] :
                getDefaultValue(colors.classex, jobType(combatant.Job, true))
        ) || "transparent"
    },
    job: {
        name: "By job",
        title: "Job colors",
        settings: [
            colorSetting("pld", "Paladin", "#151c64"),
            colorSetting("war", "Warrior", "#991717"),
            colorSetting("drk", "Dark Knight", "#880e4f"),
            colorSetting("mnk", "Monk", "#ff9800"),
            colorSetting("drg", "Dragoon", "#3f51b5"),
            colorSetting("brd", "Bard", "#9e9d24"),
            colorSetting("nin", "Ninja", "#d32f2f"),
            colorSetting("smn", "Summoner", "#2e7d32"),
            colorSetting("blm", "Black Mage", "#7e57c2"),
            colorSetting("mch", "Machinist", "#0097a7"),
            colorSetting("whm", "White Mage", "#757575"),
            colorSetting("sch", "Scholar", "#7986cb"),
            colorSetting("ast", "Astrologian", "#795548"),
        ],
        getColor: (settings, combatant) => (settings && settings[classToJob(combatant.Job)] ? settings[classToJob(combatant.Job)] : getDefaultValue(colors.class, classToJob(combatant.Job))) || "transparent"
    },
    custom: {
        name: "By custom definition, transparent otherwise"
    }
}

export function renderColorSettings(type, settings, ev) {
    if (!colors[type].settings) return

    return <fieldset>
        <legend>{colors[type].title}</legend>
        {colors[type].settings.map(def =>
            renderCellInput(type, def, settings ? settings[def.key] : null, ev)
        )}
    </fieldset>
}

export function getColor(type, settings, combatant, overwrites) {
    if (!colors[type].getColor) return

    const overwrite = Array.isArray(overwrite) ? overwrites.find(ow => {
        const re = new RegExp("^" + ow.search + "$", "i")
        return combatant.name.match(re) ||
            combatant.Job.match(re) ||
            jobType(combatant.Job).match(re) ||
            jobType(combatant.Job, true).match(re) ||
            classToJob(combatant.Job).match(re) ||
            (Jobs[classToJob(combatant.Job)] || "").match(re)
    }) : false

    if (overwrite) return overwrite.color

    return colors[type].getColor(settings, combatant)
}

export const fills = {
    plain: {
        name: "Plain Color",
        getTexture(color) {
            return color
        }
    },
    stripes: {
        name: "Striped",
        getTexture(color) {
            const light = Color(color).lighten(0.4).string()
            const dark = Color(color).desaturate(0.6).string()
            return `repeating-linear-gradient(45deg, ${light}, ${light} 10px, ${dark} 10px, ${dark} 20px)`
        }
    },
    vgrad: {
        name: "Vertical Gradient",
        getTexture(color) {
            return `linear-gradient(to bottom, ${Color(color).lighten(0.4).string()}, ${Color(color).desaturate(0.6).string()})`
        }
    },
    hgrad: {
        name: "Horitzontal Gradient",
        getTexture(color) {
            return `linear-gradient(to right, ${Color(color).lighten(0.4).string()}, ${Color(color).desaturate(0.6).string()})`
        }
    },
}

export function getTexture(type, color) {
    return fills[type].getTexture(color)
}

export const styles = {
    bline: {
        name: "Line on the bottom",
        style: { height: "1px", bottom: "1px" }
    },
    tline: {
        name: "Line on the top",
        style: { height: "1px", top: "1px" }
    },
    bar: {
        name: "Simple bar",
        style: { top: 0, bottom: 0, opacity: 0.6 }
    },
    rbar: {
        name: "Bar rounded on the right",
        style: { top: 0, bottom: 0, opacity: 0.6, borderTopRightRadius: "0.5em", borderBottomRightRadius: "0.5em" }
    },
    fbar: {
        name: "Bar rounded on all corners",
        style: { top: 0, bottom: 0, opacity: 0.6, borderTopRightRadius: "0.5em", borderBottomRightRadius: "0.5em", borderTopLeftRadius: "0.5em", borderBottomLeftRadius: "0.5em" }
    },
    transparent: {
        name: "Transparent",
        style: {}
    }
}

export function getStyle(type, textureType, colorType, settings, combatant, overwrites) {
    const color = getColor(colorType, settings, combatant, overwrites)
    return Object.assign({ background: getTexture(textureType, color) }, styles[type].style)
}

export function defaultMeterSettings() {
    return {
        cgen: Object.keys(colors)[0],
        fill: Object.keys(fills)[0],
        style: Object.keys(styles)[0],
        color: { custom: [] }
    }
}
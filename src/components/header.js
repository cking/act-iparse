import { h, Component } from "preact"

function generateStats(props) {
    switch (props.settings.stats) {
        case "dps": return props.encounter.ENCDPS + " DPS"
        case "hps": return props.encounter.ENCHPS + " HPS"
        case "dps-hps": return `${props.encounter.ENCDPS} DPS / ${props.encounter.ENCHPS} HPS`
        default: return ""
    }
}

function generateStrongestHits(props) {
    switch (props.settings.strongest) {
        case "hit": return props.encounter.maxhit
        case "heal": return props.encounter.maxheal
        case "hit-heal": return props.encounter.maxhit + " / " + props.encounter.maxheal
        default: return ""
    }
}

export default function Header(props) {
    if (!props.encounter) {
        return <div id="header">waiting for data...</div>
    }

    const timer = props.settings.time ? <span className={props.settings.highlight && props.isActive ? "green" : "white"}>[{props.encounter.duration}]</span> : ""
    const target = props.settings.target ? props.encounter.title + ":" : ""
    const deaths = props.settings.deaths? props.encounter.deaths + "†" : ""

    const statSplitter = props.settings.strongest && props.settings.stats? "-": ""

    return <div id="header">{timer} {target} <span className="blue">{generateStats(props)} {statSplitter} {generateStrongestHits(props)}</span> {deaths}</div>
}
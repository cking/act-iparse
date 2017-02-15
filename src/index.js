import snapshot from "./snapshot.js"
import h from 'inferno-create-element'
import Inferno from "inferno"

import MainWindow from "./components/mainwindow"
import ConfigWindow from "./components/configwindow"
import { defaultCellSettings } from "./components/columns"
import { defaultMeterSettings } from "./components/meter"
import { jsonParseDefault } from "./util"
import humane from "humane-js"

// define default settings
// TODO: merge undefined settings
localStorage.setItem("header", JSON.stringify(Object.assign({}, {
    time: true,
    highlight: true,
    target: true,
    stats: "dps-hps",
    strongest: "",
    deaths: false,
}, jsonParseDefault(localStorage.getItem("header"), {}))))

localStorage.setItem("meter", JSON.stringify(Object.assign(defaultMeterSettings(), jsonParseDefault(localStorage.getItem("meter"), {}))))

{
    let newCells = false
    const cells = jsonParseDefault(localStorage.getItem("cells"), [])
    const newInstall = !cells.length
    const defaults = defaultCellSettings()
    defaults.forEach(cell => {
        if (!cells.find(c => c.id == cell.id)) {
            newCells = true && !newInstall
            cells.push(Object.assign({}, cell, { enabled: newInstall ? cell.enabled : false }))
        }
    })

    if (newCells) humane.log("New table cells have been added, check your settings!")
    localStorage.setItem("cells", JSON.stringify(cells))
}

// need to define it on window, buble would remove it otherwise
window.renderParser = target => {
    Inferno.render((
        <MainWindow />
    ), target)

    if (!window.OverlayPluginApi) {
        document.dispatchEvent(new CustomEvent("onOverlayDataUpdate", { detail: snapshot }))
        document.dispatchEvent(new CustomEvent("onOverlayStateUpdate", { detail: { isLocked: false } }))
    }
}

// need to define it on window, buble would remove it otherwise
window.renderConfig = target => {
    Inferno.render((
        <ConfigWindow />
    ), target)
}
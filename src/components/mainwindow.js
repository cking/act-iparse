import h from 'inferno-create-element'
import Component from "inferno-component"
import { linkEvent } from "inferno"

import Header from "./header"
import Table from "./table"

import humane from "humane-js"
import { current as currentVersion } from "../changelog"

export default class MainWindow extends Component {
    constructor(props) {
        super(props)

        this.state = {
            isLocked: false,
            isActive: false,
            encounter: null,
            combatants: null,

            headerSettings: {},
            cellsSettings: [],
        }
        this.overlayStateUpdate = this.overlayStateUpdate.bind(this)
        this.overlayDataUpdate = this.overlayDataUpdate.bind(this)
        this.message = this.message.bind(this)
    }

    overlayStateUpdate(e) {
        this.setState({
            isLocked: e.detail.isLocked
        })
    }

    overlayDataUpdate(e) {
        this.setState({
            isActive: e.detail.isActive,
            encounter: e.detail.Encounter,
            combatants: e.detail.Combatant,
        })
    }

    message(e) {
        try {
            const settings = {}
            settings[e.data.reload + "Settings"] = JSON.parse(window.localStorage.getItem(e.data.reload))
            this.setState(settings)
        } catch (ex) { }
    }

    componentWillMount() {
        try {
            this.setState({
                headerSettings: JSON.parse(window.localStorage.getItem("header")),
                cellsSettings: JSON.parse(window.localStorage.getItem("cells")),
                meterSettings: JSON.parse(window.localStorage.getItem("meter"))
            })
        } catch (ex) { }
    }

    componentDidMount() {
        document.addEventListener("onOverlayStateUpdate", this.overlayStateUpdate)
        document.addEventListener("onOverlayDataUpdate", this.overlayDataUpdate)
        window.addEventListener("message", this.message)

        if ((window.localStorage["version"] || window.localStorage["cells"]) && window.localStorage["version"] != currentVersion) {
            humane.log("A new version was released, check about page for details!")
        } else if (!window.localStorage["version"]) {
            this.openConfigWindow(this, null)
        }

        window.localStorage["version"] = currentVersion
    }

    componentWillUnmount() {
        document.removeEventListener("onOverlayStateUpdate", this.overlayStateUpdate)
        document.removeEventListener("onOverlayDataUpdate", this.overlayDataUpdate)
        window.removeEventListener("message", this.message)
    }

    openConfigWindow(ctx, ev) {
        if (ctx.config && ctx.config.closed) ctx.config = null
        if (!ctx.config) ctx.config = window.open("config.html", "_blank", "height=560,width=720")
        ctx.config.focus()
        humane.log("Configuration screen opened, check your background windows")
    }

    render() {
        const resizeHandle = this.state.isLocked ? "" : (<div id="resize"></div>)
        const configureButtons = this.state.isLocked ? "" : (<div class="btngrp">
            <button onClick={linkEvent(this, this.openConfigWindow)}><span className="ion-gear-a"></span></button>
        </div>)
        return (
            <div>
                <Header isActive={this.state.isActive} encounter={this.state.encounter} settings={this.state.headerSettings} />
                <Table combatants={this.state.combatants} settings={this.state.cellsSettings} encounter={this.state.encounter} meter={this.state.meterSettings} misc={this.state.headerSettings} />
                {configureButtons}
                {resizeHandle}
            </div>
        )
    }
}
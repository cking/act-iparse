"use strict"

const humane = require("humane-js")

module.exports = class {
    onCreate(input) {
        this.state =  {
            isLocked: false,
            settings: {
                general: JSON.parse(localStorage.getItem("general")),
                header: JSON.parse(localStorage.getItem("header")),
                cells: JSON.parse(localStorage.getItem("cells")),
                meter: JSON.parse(localStorage.getItem("meter")),
            }
        }

        this.configWindow = null

        this.onOverlayStateUpdate = this.onOverlayStateUpdate.bind(this)
        this.onOverlayDataUpdate = this.onOverlayDataUpdate.bind(this)
        this.onStorage = this.onStorage.bind(this)

        const hash = window.location.hash
        if (hash.length > 1) {
            const url = atob(hash.substr(1))
            this.receiver = new WebSocket((url.substr(0, 2) != "ws" ? "ws://" : "") + url)
            this.receiver.onmessage = evt => {
                this.overlayDataUpdate({ detail: JSON.parse(evt.data) })
            }
        }

        if (this.state.settings.general.wsrelay) {
            this.socket = new WebSocket(this.state.settings.general.wsrelay)
        }
    }

    openConfigWindow() {
        if (this.configWindow && this.configWindow.closed) this.configWindow = null
        if (!this.configWindow) this.configWindow = window.open("config.html", "_blank", "height=560,width=720")
        this.configWindow.focus()
        humane.log("Configuration screen opened, check your background windows")
    }

    onOverlayStateUpdate(e) {
        this.setState("isLocked", e.detail.isLocked)
    }

    onOverlayDataUpdate(e) {
        this.setState({
            isActive: e.detail.isActive,
            encounter: e.detail.Encounter,
            combatants: e.detail.Combatant,
        })

        if (this.socket) {
            this.socket.send(JSON.stringify(e.detail))
        }
    }

    onStorage(e) {
        const newVal = JSON.parse(e.newValue)
        if (e.key === "general") {
            if (newVal.wsrelay !== this.state.general.wsrelay && newVal.wsrelay) {
                this.socket = new WebSocket(newVal.wsrelay)
            }
        }

        this.setState(e.key, newVal)
    }

    onMount() {
        document.addEventListener("onOverlayStateUpdate", this.onOverlayStateUpdate)
        document.addEventListener("onOverlayDataUpdate", this.onOverlayDataUpdate)
        window.addEventListener("storage", this.onStorage)

        if (!window.OverlayPluginApi) {
            document.dispatchEvent(new CustomEvent("onOverlayDataUpdate", { detail: require("./util/snapshot.json") }))
            document.dispatchEvent(new CustomEvent("onOverlayStateUpdate", { detail: { isLocked: false } }))
        }
    }

    onDestroy() {
        document.removeEventListener("onOverlayStateUpdate", this.onOverlayStateUpdate)
        document.removeEventListener("onOverlayDataUpdate", this.onOverlayDataUpdate)
        window.removeEventListener("storage", this.onStorage)
        this.socket = null
    }
}
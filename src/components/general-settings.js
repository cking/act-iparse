import { h, Component } from "preact"
import humane from "humane-js"

import { defaultCellSettings } from "./columns"
import { defaultMeterSettings } from "./meter"

export default class GeneralSettings extends Component {
    constructor(props) {
        super(props)

        this.defaultState = {
            time: true,
            highlight: true,
            target: true,
            stats: "dps-hps",
            strongest: "",
            deaths: false,
            customName: "YOU",
        }

        this.state = {
            time: true,
            highlight: true,
            target: true,
            stats: "dps-hps",
            strongest: "",
            deaths: false,
            customName: "YOU",
        }
    }

    componentWillMount() {
        try {
            this.setState(JSON.parse(window.localStorage.getItem("header")))
        } catch (ex) { }
    }

    changeValue(ev) {
        const state = {}
        state[ev.target.id] = ev.target.type === "checkbox" || ev.target.type === "radio"? ev.target.checked : ev.target.value
        this.setState(state)
    }

    saveForm(ev) {
        window.localStorage.setItem("header", JSON.stringify(this.state))
        humane.log("Settings saved!")

        window.opener && window.opener.postMessage({
            reload: "header"
        }, "*")

        ev.preventDefault()
    }

    resetSettings(ev) {
        if (!confirm("Do you really want to reset all settings?")) return
        this.setState(this.defaultState)
        window.localStorage.setItem("header", JSON.stringify(this.defaultState))
        window.localStorage.setItem("cells", JSON.stringify(defaultCellSettings()))
        window.localStorage.setItem("meter", JSON.stringify(defaultMeterSettings()))
        humane.log("Settings reset!")

        window.opener.postMessage({
            reload: "cells"
        }, "*")
        window.opener.postMessage({
            reload: "header"
        }, "*")
        window.opener.postMessage({
            reload: "meter"
        }, "*")

        ev.preventDefault()
        ev.stopPropagation()
    }

    render() {
        const wsrelayaddress = this.state.wsrelay? (<span>Share the link via <input type="text" class="pure-input-2-3" value={`${location.protocol}//${location.hostname}${location.port? ":" + location.port: ""}${location.pathname.replace(/config\.html$/, "")}#${btoa(this.state.wsrelay)}`} locked /></span>): ""
        return (
            <div className="pure-u-3-4 content">
                <div class="title">
                    General
                </div>

                <form class="pure-form pure-form-aligned" onsubmit={this.saveForm.bind(this)} method="post">
                    <fieldset>
                        <legend>Miscellaneous</legend>

                        <div className="pure-control-group">
                            <label for="customName">Your ACT Name</label>
                            <input id="customName" type="text" name="customName" value={this.state.customName} onInput={this.changeValue.bind(this)} />
                        </div>

                        <div className="pure-control-group">
                            <label for="wsrelay">Websocket Relay</label>
                            <input id="wsrelay" type="text" name="wsrelay" value={this.state.wsrelay} onInput={this.changeValue.bind(this)} />
                            <div class="pure-form-message-inline">
                                Setup a server using <a href="https://www.npmjs.com/package/wsrelay" target="_BLANK">wsrelay</a> to forward messages to other clients<br />
                                {wsrelayaddress}
                            </div>
                        </div>
                    </fieldset>
                    <fieldset>
                        <legend>Header</legend>

                        <div className="pure-control-group">
                            <label for="time">Show running time</label>
                            <input id="time" type="checkbox" name="time" checked={this.state.time} onClick={this.changeValue.bind(this)} />
                        </div>

                        <div className="pure-control-group">
                            <label for="highlight">Highlight fight</label>
                            <input id="highlight" type="checkbox" name="highlight" checked={this.state.highlight} onClick={this.changeValue.bind(this)} />
                            <span class="pure-form-message-inline">Changes the color of the running time, if in an active encounter</span>
                        </div>

                        <div className="pure-control-group">
                            <label for="target">Show target</label>
                            <input id="target" type="checkbox" name="target" checked={this.state.target} onClick={this.changeValue.bind(this)} />
                        </div>

                        <div className="pure-control-group">
                            <label for="stats">DPS / HPS Statistics</label>
                            <select id="stats" name="stats" onchange={this.changeValue.bind(this)}>
                                <option value="dps" selected={this.state.stats == "dps"}>Show DPS</option>
                                <option value="hps" selected={this.state.stats == "hps"}>Show HPS</option>
                                <option value="dps-hps" selected={this.state.stats == "dps-hps"}>Show DPS and HPS</option>
                                <option value="" selected={this.state.stats == ""}>Show Nothing</option>
                            </select>
                        </div>

                        <div className="pure-control-group">
                            <label for="strongest">Strongest action</label>
                            <select id="strongest" name="strongest" onchange={this.changeValue.bind(this)}>
                                <option value="hit" selected={this.state.strongest == "hit"}>Strongest Hit</option>
                                <option value="heal" selected={this.state.strongest == "heal"}>Strongest Heal</option>
                                <option value="hit-heal" selected={this.state.strongest == "hit-heal"}>Strongest Hit and Heal</option>
                                <option value="" selected={this.state.strongest == ""}>Show Nothing</option>
                            </select>
                        </div>

                        <div className="pure-control-group">
                            <label for="deaths">Show player deaths</label>
                            <input id="deaths" type="checkbox" name="deaths" checked={this.state.deaths} onClick={this.changeValue.bind(this)} />
                        </div>
                    </fieldset>

                    <fieldset>
                        <button type="submit" class="pure-button">Save</button>
                        <button type="button" class="pure-button" onClick={this.resetSettings.bind(this)}>Reset</button>
                    </fieldset>
                </form>
            </div>

        )
    }
}
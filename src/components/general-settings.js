import h from 'inferno-create-element'
import Component from "inferno-component"
import { linkEvent } from "inferno"
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
        }

        this.state = {
            time: true,
            highlight: true,
            target: true,
            stats: "dps-hps",
            strongest: "",
            deaths: false,
        }
    }

    componentWillMount() {
        try {
            this.setState(JSON.parse(window.localStorage.getItem("header")))
        } catch (ex) { }
    }

    changeValue(ctx, ev) {
        const state = {}
        state[ev.target.id] = ev.target.checked !== undefined ? ev.target.checked : ev.target.value
        ctx.setState(state)
    }

    saveForm(ctx, ev) {
        window.localStorage.setItem("header", JSON.stringify(ctx.state))
        humane.log("Settings saved!")

        window.opener.postMessage({
            reload: "header"
        }, "*")

        ev.preventDefault()
    }

    resetSettings(ctx, ev) {
        if (!confirm("Do you really want to reset all settings?")) return
        ctx.setState(ctx.defaultState)
        window.localStorage.setItem("header", JSON.stringify(ctx.defaultState))
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
        return (
            <div className="pure-u-3-4 content">
                <div class="title">
                    General
                </div>

                <form class="pure-form pure-form-aligned" onsubmit={linkEvent(this, this.saveForm)} method="post">
                    <fieldset>
                        <legend>Header</legend>

                        <div className="pure-control-group">
                            <label for="time">Show running time</label>
                            <input id="time" type="checkbox" name="time" checked={this.state.time} onClick={linkEvent(this, this.changeValue)} />
                        </div>

                        <div className="pure-control-group">
                            <label for="highlight">Highlight fight</label>
                            <input id="highlight" type="checkbox" name="highlight" checked={this.state.highlight} onClick={linkEvent(this, this.changeValue)} />
                            <span class="pure-form-message-inline">Changes the color of the running time, if in an active encounter</span>
                        </div>

                        <div className="pure-control-group">
                            <label for="target">Show target</label>
                            <input id="target" type="checkbox" name="target" checked={this.state.target} onClick={linkEvent(this, this.changeValue)} />
                        </div>

                        <div className="pure-control-group">
                            <label for="stats">DPS / HPS Statistics</label>
                            <select id="stats" name="stats" onchange={linkEvent(this, this.changeValue)}>
                                <option value="dps" selected={this.state.stats == "dps"}>Show DPS</option>
                                <option value="hps" selected={this.state.stats == "hps"}>Show HPS</option>
                                <option value="dps-hps" selected={this.state.stats == "dps-hps"}>Show DPS and HPS</option>
                                <option value="" selected={this.state.stats == ""}>Show Nothing</option>
                            </select>
                        </div>

                        <div className="pure-control-group">
                            <label for="strongest">Strongest action</label>
                            <select id="strongest" name="strongest" onchange={linkEvent(this, this.changeValue)}>
                                <option value="hit" selected={this.state.strongest == "hit"}>Strongest Hit</option>
                                <option value="heal" selected={this.state.strongest == "heal"}>Strongest Heal</option>
                                <option value="hit-heal" selected={this.state.strongest == "hit-heal"}>Strongest Hit and Heal</option>
                                <option value="" selected={this.state.strongest == ""}>Show Nothing</option>
                            </select>
                        </div>

                        <div className="pure-control-group">
                            <label for="deaths">Show player deaths</label>
                            <input id="deaths" type="checkbox" name="deaths" checked={this.state.deaths} onClick={linkEvent(this, this.changeValue)} />
                        </div>
                    </fieldset>

                    <fieldset>
                        <button type="submit" class="pure-button">Save</button>
                        <button type="button" class="pure-button" onClick={linkEvent(this, this.resetSettings)}>Reset</button>
                    </fieldset>
                </form>
            </div>

        )
    }
}
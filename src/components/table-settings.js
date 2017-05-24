import { h, Component } from "preact"
import humane from "humane-js"
import dragula from "dragula"
import { defaultCellSettings, default as columnDefinitions } from "./columns"
import { queryClosestSelector, arrayMove } from "../util"

export default class TableSettings extends Component {
    constructor(props) {
        super(props)

        this.drake = null

        this.state = {
            cells: defaultCellSettings()
        }
    }

    componentWillMount() {
        try {
            this.setState({
                cells: JSON.parse(window.localStorage.getItem("cells"))
            })
        } catch (ex) { }
    }

    componentDidMount() {
        this.drake = dragula([document.getElementById("dragOrder")], {
            moves(el, source, handle, sibling) {
                return handle.classList.contains("ion-drag")
            }
        }).on("drop", (el, target, source, sibling) => {
            const cells = []

            for (let i = 0; i < this.state.cells.length; i++) {
                if (i == +el.dataset.idx) continue
                if (sibling && i == +sibling.dataset.idx) cells.push(this.state.cells[+el.dataset.idx])
                cells.push(this.state.cells[i])
            }

            if (!sibling) {
                cells.push(this.state.cells[+el.dataset.idx])
            }

            this.drake.cancel(true)
            this.setState({ cells })
        })

        document.querySelector("#dragOrder").addEventListener("click", ev => {
            if (ev.target.classList.contains("options")) {
                const key = ev.target.parentNode.dataset.key

                const cells = this.state.cells
                const cell = cells.find(cell => cell.id == key)
                cell.open = !cell.open

                this.setState({ cells })
            }
        })
    }

    componentWillUnmount() {
        this.drake.destroy()
    }

    toggleCell(ev) {
        const cellId = queryClosestSelector(ev.target, "li").dataset.key
        const val = ev.target.checked
        const cells = this.state.cells
        const cell = cells.find(c => c.id == cellId)
        cell.enabled = val
        this.setState({ cells })
    }

    changeValue(ev) {
        const cellId = queryClosestSelector(ev.target, "li").dataset.key
        const optId = ev.target.name.split("-")[1]
        let val = ev.target.type === "checkbox" ? ev.target.checked : ev.target.value

        const cells = this.state.cells
        const cell = cells.find(c => c.id == cellId)

        if (!cell) {
            cells.push({
                id: cellId, opts: [{ id: optId, value: val }]
            })
        } else {
            const opt = cell.opts.find(o => o.id == optId)
            if (!opt) {
                cell.opts = cell.opts || []
                cell.opts.push({ id: optId, value: val })
            } else {
                opt.value = val
            }
        }
        this.setState({ cells })
    }

    saveForm(ev) {
        window.localStorage.setItem("cells", JSON.stringify(this.state.cells.map(c => {
            const nc = Object.assign({}, c)
            delete nc.open
            return nc
        })))
        humane.log("Settings saved!")

        window.opener.postMessage({
            reload: "cells"
        }, "*")

        ev.preventDefault()
    }

    resetSettings(ev) {
        if (!confirm("Do you really want to reset your settings?")) return
        this.setState({ cells: defaultCellSettings() })
        window.localStorage.setItem("cells", JSON.stringify(this.state.cells))
        humane.log("Settings reset!")

        window.opener && window.opener.postMessage({
            reload: "cells"
        }, "*")

        ev.preventDefault()
        ev.stopPropagation()
    }

    renderCellInput(def, cell) {
        const label = <label for={cell.id + "-" + def.key} title={def.description}>{def.name}</label>
        const v = cell.opts.find(opt => opt.id == def.key)
        const val = v ? v.value : def.default
        switch (def.type) {
            case "text": return [label, (<input id={cell.id + "-" + def.key} name={cell.id + "-" + def.key} value={val} type="text" onInput={this.changeValue.bind(this)} />)]
            case "option": return [<span className="label" title={def.description}>{def.name}</span>, Object.keys(def.values).map(k => <label class="pure-radio">
                <input type="radio" id={cell.id + "-" + def.key} name={cell.id + "-" + def.key} value={k} checked={val == k} onClick={this.changeValue.bind(this)} />{def.values[k]}
            </label>)]
            case "checkbox": return [
                <span className="label">{def.name}</span>,
                (<label class="pure-checkbox">
                    <input type="checkbox" id={cell.id + "-" + def.key} name={cell.id + "-" + def.key} checked={val} onClick={this.changeValue.bind(this)} />
                </label>),
                <span className="pure-help-inline">{def.description}</span>
            ]
            case "select": return [label, (<select id={cell.id + "-" + def.key} name={cell.id + "-" + def.key} onChange={this.changeValue.bind(this)}>
                {Object.keys(def.values).map(k => <option value={k} selected={val == k}>{def.values[k]}</option>)}
            </select>)]
        }
    }

    renderCellSettings(cell, idx) {
        const col = columnDefinitions.find(col => col.key == cell.id)
        if (!col) return ""

        return (<li {... { "data-key": cell.id, "data-idx": idx }}>
            <span className="ion-drag"></span>
            <div>
                <input type="checkbox" name="enabled" checked={cell.enabled} onClick={this.toggleCell.bind(this)} /> <strong title={col.description}>{col.name}</strong>
                <fieldset style={{ display: cell.open ? "block" : "none" }}>
                    {col.options.map(opt => {
                        return (<div className="pure-control-group">
                            {this.renderCellInput(opt, cell)}
                        </div>)
                    })}
                </fieldset>
            </div>
            <span className={(cell.open ? "ion-arrow-up-b" : "ion-arrow-down-b") + " options"}></span>
        </li>)
    }

    render() {
        return (
            <div className="pure-u-3-4 content">
                <form class="pure-form pure-form-aligned" onSubmit={this.saveForm.bind(this)} method="post">
                    <div class="title">
                        Table
                        <button type="submit" class="pure-button">Save</button>
                    </div>

                    <p>
                        The order is from left to right, unchecked items are hidden. Drag items by the bars left; configure them with the arrow on the right.
                </p>

                    <fieldset>
                        <ol id="dragOrder">
                            {this.state.cells.map(this.renderCellSettings, this)}
                        </ol>
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
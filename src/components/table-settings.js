import h from 'inferno-create-element'
import Component from "inferno-component"
import { linkEvent } from "inferno"
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

    toggleCell(ctx, ev) {
        const cellId = queryClosestSelector(ev.target, "li").dataset.key
        const val = ev.target.checked
        const cells = ctx.state.cells
        const cell = cells.find(c => c.id == cellId)
        cell.enabled = val
        ctx.setState({ cells })
    }

    changeValue(ctx, ev) {
        const cellId = queryClosestSelector(ev.target, "li").dataset.key
        const optId = ev.target.name.split("-")[1]
        let val = ev.target.type === "checkbox" ? ev.target.checked : ev.target.value

        const cells = ctx.state.cells
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
        ctx.setState({ cells })
    }

    saveForm(ctx, ev) {
        window.localStorage.setItem("cells", JSON.stringify(ctx.state.cells.map(c => {
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

    resetSettings(ctx, ev) {
        if (!confirm("Do you really want to reset your settings?")) return
        ctx.setState({ cells: defaultCellSettings() })
        window.localStorage.setItem("cells", JSON.stringify(ctx.state.cells))
        humane.log("Settings reset!")

        window.opener.postMessage({
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
            case "text": return [label, (<input id={cell.id + "-" + def.key} name={cell.id + "-" + def.key} value={val} type="text" onInput={linkEvent(this, this.changeValue)} />)]
            case "option": return [<span className="label" title={def.description}>{def.name}</span>, Object.keys(def.values).map(k => <label class="pure-radio">
                <input type="radio" id={cell.id + "-" + def.key} name={cell.id + "-" + def.key} value={k} checked={val == k} onClick={linkEvent(this, this.changeValue)} />{def.values[k]}
            </label>)]
            case "checkbox": return [
                <span className="label">{def.name}</span>,
                (<label class="pure-checkbox">
                    <input type="checkbox" id={cell.id + "-" + def.key} name={cell.id + "-" + def.key} checked={val} onClick={linkEvent(this, this.changeValue)} />
                </label>),
                <span className="pure-help-inline">{def.description}</span>
            ]
            case "select": return [label, (<select id={cell.id + "-" + def.key} name={cell.id + "-" + def.key} onChange={linkEvent(this, this.changeValue)}>
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
                <input type="checkbox" name="enabled" checked={cell.enabled} onClick={linkEvent(this, this.toggleCell)} /> <strong title={col.description}>{col.name}</strong>
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
                <form class="pure-form pure-form-aligned" onSubmit={linkEvent(this, this.saveForm)} method="post">
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
                        <button type="button" class="pure-button" onClick={linkEvent(this, this.resetSettings)}>Reset</button>
                    </fieldset>
                </form>
            </div>

        )
    }
}
import { h, Component } from "preact"
import humane from "humane-js"
import { Jobs } from "../util"
import { colors, renderColorSettings, getColor, fills, getTexture, styles, getStyle } from "./meter"
import ColorPicker from "../ui/color-picker"

export default class ColorSettings extends Component {
    constructor(props) {
        super(props)

        this.state = {
            style: "bar",
            fill: "plain",
            cgen: "checksum",
            exampleName: "Vanthia Orcus",
            exampleJob: "",
            transparency: 0,

            color: {
                custom: []
            }
        }
    }


    componentWillMount() {
        try {
            this.setState(JSON.parse(window.localStorage.getItem("meter")))
        } catch (ex) { }
    }


    componentDidMount() {
        this.preview = window.setInterval(() => {
            this.refreshPreview()
        }, 100)
    }

    componentWillUnmount() {
        if (this.preview) window.clearInterval(this.preview)
    }

    refreshPreview() {
        document.querySelector(".meter.preview div").style.background = getTexture(this.state.fill, getColor(this.state.cgen, this.state.color[this.state.cgen], {
            name: this.state.exampleName,
            Job: this.state.exampleJob,
        }, this.state.color.custom))
    }

    addNewColorOverwrite(ev) {
        const color = this.state.color
        color.custom.push({ color: "#000000" })
        this.setState({ color })

        ev.preventDefault()
    }

    removeColorOverwrite(ev) {
        const color = Object.assign({}, this.state.color)
        color.custom.splice(ev.target.dataset.id, 1)
        this.setState({ color })

        ev.preventDefault()
    }

    changeValue(ev) {
        const o = {}
        let val = ev.target.type === "checkbox" ? ev.target.checked : ev.target.value
        if (ev.target.name.indexOf("-") < 0) {
            o[ev.target.name] = val
        } else {
            o.color = this.state.color || {custom:{}}
            const [cat, key, type] = ev.target.name.split("-")
            if (!type) {
                o.color[cat] = this.state.color[cat] || {}
                o.color[cat][key] = val
            } else {
                o.color[cat] = this.state.color[cat] || {}
                o.color[cat][key] = o.color[cat][key] || {}
                o.color[cat][key][type] = val
            }
        }
        this.setState(o)
    }

    saveForm(ev) {
        const o = Object.assign({}, this.state)
        delete o.exampleName
        delete o.exampleJob
        window.localStorage.setItem("meter", JSON.stringify(o))
        humane.log("Settings saved!")

        window.opener.postMessage({
            reload: "meter"
        }, "*")

        ev.preventDefault()
    }

    render() {
        return (
            <div className="pure-u-3-4 content">
                <form class="pure-form pure-form-aligned" onSubmit={this.saveForm.bind(this)} method="post">
                    <div class="title">
                        Colors
                        <button type="submit" class="pure-button">Save</button>
                    </div>

                    <fieldset>
                        <legend>Bar Style</legend>

                        <div className="pure-control-group">
                            <label for="style">Choose Style</label>
                            <select id="style" name="style" onChange={this.changeValue.bind(this)}>
                                {Object.keys(styles).map(key => <option value={key} selected={this.state.style == key}>{styles[key].name}</option>)}
                            </select>
                        </div>

                        <div className="pure-control-group">
                            <label for="fill">Choose fill method</label>
                            <select id="fill" name="fill" onChange={this.changeValue.bind(this)}>
                                {Object.keys(fills).map(key => <option value={key} selected={this.state.fill == key}>{fills[key].name}</option>)}
                            </select>
                        </div>

                        <div className="pure-control-group">
                            <label for="fill">Choose transparency</label>
                            <input type="range" min="0" max="100" id="transparency" name="transparency" value={this.state.transparency} onInput={this.changeValue.bind(this)} />
                        </div>

                        <div className="pure-control-group">
                            <label for="cgen">Choose color selection mode</label>
                            <select id="cgen" name="cgen" onChange={this.changeValue.bind(this)}>
                                {Object.keys(colors).map(key => <option value={key} selected={this.state.cgen == key}>{colors[key].name}</option>)}
                            </select>
                        </div>
                    </fieldset>

                    {renderColorSettings(this.state.cgen, this.state.color[this.state.cgen], this.changeValue.bind(this))}

                    <fieldset>
                        <legend>Custom colors</legend>

                        <p>
                            The search query runs on the character name, their job and job type in an case insensitive fashion.
                            If the search matches, the specified color will be used instead of the generated one.
                        </p>

                        {this.state.color.custom.map((line, idx) => (
                            <div class="pure-control-group">
                                <input className="label" id={"custom-" + idx + "-search"} name={"custom-" + idx + "-search"} value={line.search || ""} type="text" placeholder="Search" onInput={this.changeValue.bind(this)} />
                                <ColorPicker id={"custom-" + idx + "-color"} name={"custom-" + idx + "-color"} value={line.color || ""} type="color" placeholder="Custom color" onInput={this.changeValue.bind(this)} />
                                <div className="pure-help-inline">
                                    <button type="button" class="pure-button" data-id={idx} onClick={this.removeColorOverwrite.bind(this)}>Remove row</button>
                                </div>
                            </div>
                        ))}

                        <div class="pure-control-group">
                            <button type="button" class="pure-button" onClick={this.addNewColorOverwrite.bind(this)}>Add new row</button>
                        </div>
                    </fieldset>

                    <fieldset>
                        <legend>Preview</legend>

                        <div className="pure-control-group">
                            <label for="example-name">Example Name</label>
                            <input id="example-name" name="exampleName" value={this.state.exampleName} type="text" onInput={this.changeValue.bind(this)} />
                        </div>

                        <div className="pure-control-group">
                            <label for="example-job">Example Job</label>
                            <select id="example-job" name="exampleJob" onChange={this.changeValue.bind(this)}>
                                <option value="" selected={!this.state.exampleJob}></option>
                                {Object.keys(Jobs).map(abbr => <option value={abbr} selected={this.state.exampleJob == abbr}>{Jobs[abbr]}</option>)}
                            </select>
                        </div>

                        <div className="meter preview">
                            <div style={Object.assign({ width: "80%" }, getStyle(
                                this.state.style,
                                this.state.fill,
                                this.state.cgen,
                                this.state.color[this.state.cgen], {
                                    name: this.state.exampleName,
                                    Job: this.state.exampleJob,
                                }, this.state.color.custom))} {... {
                                    "data-cgen": this.state.cgen,
                                    "data-style": this.state.style,
                                    "data-fill": this.state.fill
                                }}></div>
                        </div>
                    </fieldset>

                    <fieldset>
                        <button type="submit" class="pure-button">Save</button>
                    </fieldset>
                </form>
            </div>
        )
    }
}
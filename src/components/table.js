import h from 'inferno-create-element'
import Component from "inferno-component"
import linkEvent from "inferno"
import { renderHeader, renderCell } from "./columns"
import { getStyle } from "./meter"

export default class Table extends Component {
    constructor(props) {
        super(props)

        this.state = {
            misc: {}
        }
    }

    renderHeader() {
        const cells = this.props.settings

        return (<div class="fable h orange">
            {cells.map(c => renderHeader(c))}
        </div>)
    }

    renderRow(idx, combatant, encounter) {
        const cells = this.props.settings
        const player = this.props.misc.customName == combatant.name ? "player" : ""

        return (
            <div class={"fable " + player}>
                <div class="meter" data-odd={idx % 2} style={{opacity: (100 - this.props.meter.transparency) / 100}}>
                    <div style={Object.assign({ width: combatant["damage%"] }, getStyle(
                        this.props.meter.style,
                        this.props.meter.fill,
                        this.props.meter.cgen,
                        this.props.meter.color[this.props.meter.cgen],
                        combatant,
                        this.props.meter.color.custom
                    ))}></div>
                </div>
                {cells.map(c => renderCell(c, idx, combatant, encounter))}
            </div>)
    }

    render() {
        const combatants = this.props.combatants
        if (!combatants) return ""

        return <div>
            {this.renderHeader()}
            {Object.keys(combatants).map((name, pos) => this.renderRow(pos, combatants[name], this.props.encounter), this)}
        </div>
    }
}

import h from 'inferno-create-element'
import Component from "inferno-component"
import { linkEvent } from "inferno"
import { Router, Route, IndexRoute, Redirect, Link } from "inferno-router"
import createHistory from "history/createHashHistory"
import GeneralSettings from "./general-settings"
import TableSettings from "./table-settings"
import ColorSettings from "./color-settings"
import { list as versionList } from "../changelog"

export class ConfigWindow extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="pure-g">
                <div className="pure-u-1-4 navigation">
                    <div className="title"><span className="ion-settings"></span> Settings</div>
                    <nav class="pure-menu indented-menu">
                        <ul class="pure-menu-list">
                            <li class="pure-menu-item">
                                <Link to="/"><span className="ion-gear-b"></span> General</Link>
                                <Link to="/table"><span className="ion-stats-bars"></span> Table</Link>
                                <Link to="/colors"><span className="ion-paintbrush"></span> Colors</Link>
                                <Link to="/about"><span className="ion-information-circled"></span> About</Link>
                            </li>
                        </ul>
                    </nav>
                </div>
                {this.props.children}
            </div>
        )
    }
}

export function AboutWindow() {
    const ava = "http://img2.finalfantasyxiv.com/f/2861123e5f08ba3652b71c008f97d9af_777c57311d510ca65dac3c1077dee435fc0_96x96.jpg?" + Date.now()
    return (
        <div className="pure-u-3-4 content">
            <div class="title">
                About
            </div>
            
            <div class="about">
                <span>Written by</span>
                <img src={ava} class="ava" />
                <a href="http://eu.finalfantasyxiv.com/lodestone/character/9384803/" target="_blank" class="name">
                    Vanthia Orcus
                </a>
                <div class="world">Cerberus</div>
            </div>

            <h2 style={{ clear: "both" }}>Changelog</h2>
            <ul>
                {Object.keys(versionList).map(v => (
                    <li>
                        <strong>{v}</strong> <em>({versionList[v].date})</em>
                        <ol>
                            {versionList[v].changes.map(c => <li>{c}</li>)}
                        </ol>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default function ConfigRouter() {
    return (
        <Router history={createHistory()}>
            <Route component={ConfigWindow}>
                <Route component={GeneralSettings} path="/" />
                <Route component={TableSettings} path="/table" />
                <Route component={ColorSettings} path="/colors" />
                <Route component={AboutWindow} path="/about" />
            </Route>
        </Router>
    )
}
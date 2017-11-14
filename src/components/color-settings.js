import { h, Component } from 'preact'
import humane from 'humane-js'
import { Jobs } from '../util'
import { colors, renderColorSettings, getColor, fills, getTexture, styles, getStyle } from './meter'
import ColorPicker from '../ui/color-picker'

export default class ColorSettings extends Component {
  constructor (props) {
    super(props)

    this.state = {
      style: 'bar',
      fill: 'plain',
      cgen: 'checksum',
      exampleName: 'Vanthia Orcus',
      exampleJob: '',
      transparency: 0,

      color: {
        custom: []
      }
    }
  }

  componentWillMount () {
    try {
      this.setState(JSON.parse(window.localStorage.getItem('meter')))
    } catch (ex) {}
  }

  componentDidMount () {
    this.preview = window.setInterval(() => {
      this.refreshPreview()
    }, 100)
  }

  componentWillUnmount () {
    if (this.preview) window.clearInterval(this.preview)
  }

  refreshPreview () {
    document.querySelector('.meter.preview div').style.background = getTexture(
      this.state.fill,
      getColor(
        this.state.cgen,
        this.state.color[this.state.cgen],
        {
          name: this.state.exampleName,
          Job: this.state.exampleJob
        },
        this.state.color.custom
      )
    )
  }

  addNewColorOverwrite (ev) {
    const color = this.state.color
    color.custom.push({ color: '#000000' })
    this.setState({ color })

    ev.preventDefault()
  }

  removeColorOverwrite (ev) {
    const color = Object.assign({}, this.state.color)
    color.custom.splice(ev.target.dataset.id, 1)
    this.setState({ color })

    ev.preventDefault()
  }

  changeValue (ev) {
    const o = {}
    let val = ev.target.type === 'checkbox' ? ev.target.checked : ev.target.value
    if (ev.target.name.indexOf('-') < 0) {
      o[ev.target.name] = val
    } else {
      o.color = this.state.color || { custom: {} }
      const [cat, key, type] = ev.target.name.split('-')
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

  saveForm (ev) {
    const o = Object.assign({}, this.state)
    delete o.exampleName
    delete o.exampleJob
    window.localStorage.setItem('meter', JSON.stringify(o))
    humane.log('Settings saved!')

    window.opener.postMessage(
      {
        reload: 'meter'
      },
      '*'
    )

    ev.preventDefault()
  }
}

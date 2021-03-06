import { h, Component } from "preact"
import Color from "color"
/*import React from 'react'
import reactCSS from 'reactcss'*/
import { SketchPicker } from "react-color"

export default class ColorPicker extends Component {
  constructor(props) {
    super(props)

    this.state = {
      displayColorPicker: false,
      color: Object.assign({ r: 1, g: 1, b: 1, a: 1 }, props && props.value ? Color(props.value).object() : {}),
    }
    this.componentWillReceiveProps(props)
  }

  componentWillReceiveProps(props) {
    if (!props || !props.value) return
    this.setState({
      color: Object.assign({ a: 1 }, Color(props.value).object())
    })
  }

  handleClick(ev) {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  }

  handleClose(ev) {
    this.setState({ displayColorPicker: false })
  }

  handleChange(color) {
    this.setState({ color: color.rgb })
    const el = document.getElementById(this.props.id)
    el.value = color.hex
    el.dispatchEvent(new Event("change"))
  }

  render() {
    return (
      <span>
        <input type="hidden" id={this.props.id} name={this.props.name} value={Color.rgb(this.state.color.r, this.state.color.g, this.state.color.b).hex()} onchange={this.props.onInput} />
        <div className="pure-button" onClick={this.handleClick.bind(this)}>
          <div style={{
            width: '36px',
            height: '14px',
            borderRadius: '2px',
            background: "rgba(" + this.state.color.r + "," + this.state.color.g + "," + this.state.color.b + "," + this.state.color.a + ")",
          }} />
        </div>
        {this.state.displayColorPicker ? <div style={{ position: 'absolute', zIndex: '2', }}>
          <div style={{
            position: 'fixed',
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px',
          }} onClick={this.handleClose.bind(this)} />
          <SketchPicker color={this.state.color} onChange={this.handleChange.bind(this)} />
        </div> : null}
      </span>
    )
  }
}

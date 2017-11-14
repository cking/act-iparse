const meter = require('../../../../ui/meter')

module.exports = class {
  onCreate () {
    this.state = {
      meter: JSON.parse(localStorage.getItem('meter')),
      example: { name: 'Vanthia Orcus', Job: 'war' }
    }
  }

  onSubmit (ev, el) {
    ev.preventDefault()
    const meter = JSON.stringify(this.state.meter)
    localStorage.setItem('meter', meter)

    humane.log('Settings saved!')
  }

  onMount () {
    this.updatePreview()
  }

  updatePreview () {
    // update state
    this.setState({
      meter: {
        style: document.getElementById('style').value,
        fill: document.getElementById('fill').value,
        cgen: document.getElementById('cgen').value,
        transparency: document.getElementById('transparency').value
      },
      example: {
        name: document.getElementById('example-name').value,
        Job: document.getElementById('example-job').value
      }
    })

    const canvas = this.getEl('preview')
    const context = canvas.getContext('2d')
    meter.render(context, Object.assign({ 'damage%': '80%' }, this.state.example), this.state.meter)
  }

  onColorChange (colors) {
    const meter = this.state.meter
    meter.custom = meter.custom || {}
    meter.custom[this.state.meter.cgen] = Object.assign({}, meter.custom[this.state.meter.cgen], colors)
    this.setState('meter', meter)
  }
}

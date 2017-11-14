const meter = require('../../../../../../ui/meter')

module.exports = class {
  onCreate () {
    this.onResize = this.onResize.bind(this)
    this.mounted = false
  }
  onDestroy () {
    window.removeEventListener('resize', this.onResize)
  }
  onMount () {
    window.addEventListener('resize', this.onResize)
    this.mounted = true
    this.onRender()
  }
  onRender () {
    if (!this.mounted) return
    const row = this.getEl('trrow')
    const canvas = this.getEl('canvas')
    canvas.style.width = row.clientWidth
    canvas.style.height = row.clientHeight
    const ctx = canvas.getContext('2d')
    meter.render(ctx, this.input.combatant, JSON.parse(localStorage.getItem('meter')))
    row.style.backgroundImage = 'url(' + canvas.toDataURL() + ')'
  }

  onResize () {
    this.onRender()
  }
}

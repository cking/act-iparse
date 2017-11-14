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
    setTimeout(() => {
      const row = this.getEl('trrow')
      const canvas = this.getEl('canvas')
      canvas.width = row.clientWidth
      canvas.height = row.clientHeight
      const ctx = canvas.getContext('2d')
      meter.render(ctx, this.input.combatant, JSON.parse(localStorage.getItem('meter')))
      row.style.backgroundImage = 'url(' + canvas.toDataURL() + ')'
    }, 1)
  }

  onResize () {
    this.onRender()
  }
}

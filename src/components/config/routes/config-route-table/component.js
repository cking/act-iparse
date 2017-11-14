module.exports = class {
  onCreate () {
    this.state = {
      cells: JSON.parse(localStorage.getItem('cells')),

      details: null
    }
  }

  onSubmit (ev, el) {
    ev.preventDefault()
    this.adjustCellOrder()

    localStorage.setItem('cells', JSON.stringify(this.state.cells))

    humane.log('Settings saved!')
  }

  onSubmitDetails (idx, ev, el) {
    ev.preventDefault()

    const column = require('../../../../ui/column')
    const cell = this.state.cells[idx]
    const col = column[cell.id]

    const fields = Array.from(document.getElementsByTagName('form')[0].elements).filter(el => el.id)
    fields.forEach(f => {
      if (f.type == 'checkbox') {
        cell.opts[f.name] = f.checked
      } else if (f.type == 'radio') {
        if (f.checked) {
          cell.opts[f.name] = f.value
        }
      } else {
        cell.opts[f.name] = f.value
      }
    })

    this.adjustCellOrder()
    this.setState('details', null)
  }

  onMount () {
    this.drake = require('dragula')([this.getEl('enabled'), this.getEl('disabled')], {})
  }

  onDestroy () {
    if (this.drake) {
      this.drake.destroy()
    }
  }

  onDetails (cell) {
    this.adjustCellOrder()

    console.log('cell details for', cell)
    const idx = this.state.cells.findIndex(c => c.id == cell)
    console.log('cell found at idx', idx)
    this.setState('details', idx)
  }

  adjustCellOrder () {
    const cells = []
    const disabled = this.getEl('disabled')
    const els = document.getElementsByClassName('cell')

    Array.from(els).forEach(el => {
      const idx = el.dataset.idx
      this.state.cells[idx].enabled = el.parentNode != disabled
      el.dataset.idx = cells.length
      cells.push(this.state.cells[idx])
    })

    this.setState('cells', cells)
  }
}

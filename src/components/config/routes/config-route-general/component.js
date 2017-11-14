module.exports = class {
  onCreate () {
    this.state = {
      general: JSON.parse(localStorage.getItem('general')),
      header: JSON.parse(localStorage.getItem('header'))
    }
  }

  onSubmit (ev, el) {
    ev.preventDefault()
    this.setState({
      general: {
        name: el.name.value,
        wsrelay: el.wsrelay.value
      },
      header: {
        time: el.time.checked,
        highlight: el.highlight.checked,
        target: el.target.checked,
        stats: el.stats.value,
        strongest: el.strongest.value,
        deaths: el.deaths.checked
      }
    })

    localStorage.setItem('general', JSON.stringify(this.state.general))
    localStorage.setItem('header', JSON.stringify(this.state.header))

    humane.log('Settings saved!')
  }
}

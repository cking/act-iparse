const humane = require('humane-js')

module.exports = class {
  onCreate (input) {
    this.state = {
      isLocked: false,
      settings: {
        general: JSON.parse(localStorage.getItem('general')),
        header: JSON.parse(localStorage.getItem('header')),
        cells: JSON.parse(localStorage.getItem('cells')),
        meter: JSON.parse(localStorage.getItem('meter'))
      },
      isActive: false,
      encounter: {},
      combatants: {}
    }

    this.configWindow = null

    // force bindings
    this.onOverlayStateUpdate = this.onOverlayStateUpdate.bind(this)
    this.onOverlayDataUpdate = this.onOverlayDataUpdate.bind(this)
    this.onStorage = this.onStorage.bind(this)

    // parse hash, for mobile usage
    const hash = window.location.hash
    if (hash.length > 1) {
      const url = atob(hash.substr(1))
      this.receiver = new WebSocket((url.substr(0, 2) != 'ws' ? 'ws://' : '') + url)
      this.receiver.onmessage = evt => {
        this.overlayDataUpdate({ detail: JSON.parse(evt.data) })
      }
    }

    // connect to the websocket as master
    this.connectWebsocket()
  }

  connectWebsocket () {
    if (this.state.settings.general.wsrelay) {
      this.socket = new WebSocket(
        (this.state.settings.general.wsrelay.substr(0, 2) != 'ws' ? 'ws://' : '') + this.state.settings.general.wsrelay
      )
    }
  }

  // open the config window
  openConfigWindow () {
    if (this.configWindow && this.configWindow.closed) this.configWindow = null
    if (!this.configWindow) this.configWindow = window.open('config', '_blank', 'height=560,width=720')
    this.configWindow.focus()
    humane.log('Configuration screen opened, check your background windows')
  }

  // update the isLocket status
  onOverlayStateUpdate (e) {
    this.state.isLocked = e.detail.isLocked
  }

  // update current frame
  onOverlayDataUpdate (e) {
    this.state.isActive = e.detail.isActive
    this.state.encounter = e.detail.Encounter
    this.state.combatants = e.detail.Combatant

    // send frame to the websocket, if socket is opened
    if (this.socket && this.socket.readyState === 1) {
      this.socket.send(JSON.stringify(e.detail))
    }
  }

  // local storage update, whoop
  onStorage (e) {
    const newVal = JSON.parse(e.newValue)
    const oldRelay = this.state.general.wsrelay
    this.state[e.key] = newVal

    if (e.key === 'general') {
      if (newVal.wsrelay !== oldRelay) {
        this.connectWebsocket()
      }
    }
  }

  // connect all listeners
  onMount () {
    document.addEventListener('onOverlayStateUpdate', this.onOverlayStateUpdate)
    document.addEventListener('onOverlayDataUpdate', this.onOverlayDataUpdate)
    window.addEventListener('storage', this.onStorage)

    if (!window.OverlayPluginApi) {
      document.dispatchEvent(new CustomEvent('onOverlayDataUpdate', { detail: require('./util/snapshot.json') }))
      document.dispatchEvent(new CustomEvent('onOverlayStateUpdate', { detail: { isLocked: false } }))
    }
  }

  // disconnect all listeners
  onDestroy () {
    document.removeEventListener('onOverlayStateUpdate', this.onOverlayStateUpdate)
    document.removeEventListener('onOverlayDataUpdate', this.onOverlayDataUpdate)
    window.removeEventListener('storage', this.onStorage)
    this.socket = null
  }
}

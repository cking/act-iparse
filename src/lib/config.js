const changelog = require('./changelog')
const column = require('../ui/column')
const uiMeter = require('../ui/meter')
const humane = require('humane-js')

function arrayToObject (arr, key, val) {
  const o = {}
  arr.forEach(item => {
    if (val === undefined) {
      const val = Object.assign({}, item)
      delete val[key]
      o[item[key]] = val
    } else {
      o[item[key]] = item[val]
    }
  })

  return o
}

function upgradeCellSettings (cells) {
  return cells.map(cell => {
    cell.opts = arrayToObject(cell.opts, 'id', 'value')
    cell.title = cell.opts.title
    delete cell.opts.title
    cell.enabled = !!cell.enabled

    return cell
  })
}

function defaultCellSettings (cells) {
  const nCells = []
  Object.keys(column).forEach(col => {
    if (typeof column[col] === 'function') return

    const def = column[col]
    const cfg = {
      id: col,
      enabled: def.enabled,
      title: def.name,
      opts: {}
    }
    Object.keys(def.options).forEach(k => (cfg.opts[k] = def.options[k].default))

    let idx = cells.find(c => c.id === col)
    if (idx >= 0) {
      while (nCells.length < oldIdx) {
        nCells.push(null)
      }

      const oldOptions = arrayToObject(cells[idx].opts, 'id', 'value')
      cfg.enabled = cells[idx].enabled
      cfg.title = oldOptions.title
      delete oldOptions.title
      Object.keys(oldOptions).forEach(k => (cfg.opts[k] = oldOptions[k]))

      nCells.splice(idx, 0, null)
    } else {
      idx = nCells.length
    }

    nCells[idx] = cfg
  })

  return nCells
}

function defaultMeterSettings (meter) {
  meter.cgen = meter.cgen || Object.keys(uiMeter.colors)[0]
  meter.fill = meter.fill || Object.keys(uiMeter.textures)[0]
  meter.style = meter.style || Object.keys(uiMeter.styles)[0]

  return meter
}

exports.load = function () {
  if (localStorage.version == '1') {
    console.log('found legacy configuration format, converting to new style')
    const oldSettings = {
      cells: JSON.parse(localStorage.cells),
      header: JSON.parse(localStorage.header),
      meter: JSON.parse(localStorage.meter)
    }

    const newSettings = {
      general: {
        name: oldSettings.header.customName,
        wsrelay: oldSettings.header.wsrelay
      },
      header: oldSettings.header,
      cells: upgradeCellSettings(oldSettings.cells),
      meter: oldSettings.meter
    }

    delete newSettings.header.customName
    delete newSettings.header.wsrelay

    // TODO: convert meter settings

    // TODO: after meter impl: localStorage.clear()
    Object.keys(newSettings).forEach(k => localStorage.setItem(k, JSON.stringify(newSettings[k])))
    localStorage.setItem('version', changelog.current)

    return true
  }

  if (localStorage.version !== changelog.current) {
    console.log('detected old version, setting default values')
    humane.log('A new version was released, check about page for details!')

    Object.keys(defaults).forEach(cat => {
      const serialized = localStorage.getItem(cat) || '{}'

      const store = JSON.parse(serialized)
      Object.keys(defaults[cat]).forEach(option => {
        if (!store.hasOwnProperty(option)) {
          store[option] = defaults[cat][option]
        }
      })
      localStorage.setItem(cat, JSON.stringify(store))
    })

    let cells = JSON.parse(localStorage.getItem('cells')) || []
    cells = defaultCellSettings(cells)
    localStorage.setItem('cells', JSON.stringify(cells))

    let meter = JSON.parse(localStorage.getItem('meter')) || {}
    meter = defaultMeterSettings(meter)
    localStorage.setItem('meter', JSON.stringify(meter))

    localStorage.setItem('version', changelog.current)

    return true
  }

  return false
}

const defaults = (exports.default = {
  general: {
    name: 'YOU',
    wsrelay: null
  },

  header: {
    time: true,
    highlight: true,
    target: true,
    stats: 'dps-hps',
    strongest: '',
    deaths: false
  }
})

const colorInputPartial = require('./partial/color-input.marko')
const settingsPartial = require('./partial/settings.marko')
const util = require('../../util')

function colorRandom () {
  const rand = parseInt(Math.random() * 255)
  const hex = rand.toString(16)
  return hex.length == 2 ? hex : '0' + hex
}

const pets = {
  defaults: {
    lb: { name: 'Limit break', default: '#BD10E0' },
    choco: { name: 'Chocobos', default: '#444444' },
    egi: { name: 'Egis and Carbuncles', default: '#2e7d32' },
    turret: { name: 'Autoturrets', default: '#0097a7' },
    fairy: { name: 'Fairies', default: '#7986cb' }
  },
  settings (out, args) {
    settingsPartial.render(
      {
        title: 'Pets and companions',
        colors: pets.defaults,
        prefix: 'pet'
      },
      out
    )
  },
  getColor (cbt, settings) {
    const type = util.getPetType(cbt.name)
    if (!type) return 'rgba(0,0,0,0)'

    return settings.pet[type] || pets.defaults[type].default
  }
}

exports.checksum = {
  name: 'By character name',

  getColor (combatant, settings) {
    var hash = 0
    if (combatant.name.length == 0) return hash
    for (var i = 0; i < combatant.name.length; i++) {
      hash = combatant.name.charCodeAt(i) + ((hash << 5) - hash)
      hash = hash & hash // Convert to 32bit integer
    }

    return 'hsl(' + (hash + 200) % 360 + ',100%,50%)'
  }
}

exports.random = {
  name: 'Random (Epilepsy warning!)',
  getColor () {
    return '#' + colorRandom() + colorRandom() + colorRandom()
  }
}

exports.class = {
  name: 'By job type',

  defaults: {
    tank: {
      name: 'Tanks',
      default: '#364597'
    },
    heal: {
      name: 'Heals',
      default: '#355b26'
    },
    dd: {
      name: 'Damage Dealers',
      default: '#643434'
    }
  },

  getColor (cbt, settings) {
    const type = util.jobType[cbt.Job.toLowerCase()]
    if (!type) {
      return pets.getColor(cbt, settings)
    } else if (type !== 'tank' && type !== 'heal') {
      type = 'dd'
    }

    if (settings.color && settings.color[type]) {
      return settings.color[type]
    }
    return exports.class.defaults[type].default
  }
}

exports.classex = {
  name: 'By job type, DD split by type',

  defaults: {
    tank: {
      name: 'Tanks',
      default: '#364597'
    },
    heal: {
      name: 'Heals',
      default: '#355b26'
    },
    melee: {
      name: 'Melees',
      default: '#864545'
    },
    range: {
      name: 'Ranged',
      default: '#643434'
    },
    mage: {
      name: 'Mages',
      default: '#64344c'
    }
  },

  settings (out, args) {
    settingsPartial.render(
      {
        title: 'Classes',
        colors: exports.classex.defaults
      },
      out
    )

    return pets.settings(out, args)
  },

  getColor (cbt, settings) {
    const type = util.jobType[cbt.Job.toLowerCase()]
    if (!type) {
      return pets.getColor(cbt, settings)
    }

    if (settings.color && settings.color[type]) {
      return settings.color[type]
    }
    return exports.classex.defaults[type].default
  }
}

exports.job = {
  name: 'By job',
  defaults: {
    pld: {
      name: 'Paladin',
      default: '#151c64'
    },

    war: {
      name: 'Warrior',
      default: '#991717'
    },

    drk: {
      name: 'Dark Knight',
      default: '#880e4f'
    },

    mnk: {
      name: 'Monk',
      default: '#ff9800'
    },

    drg: {
      name: 'Dragoon',
      default: '#3f51b5'
    },

    brd: {
      name: 'Bard',
      default: '#9e9d24'
    },

    nin: {
      name: 'Ninja',
      default: '#d32f2f'
    },

    smn: {
      name: 'Summoner',
      default: '#2e7d32'
    },

    blm: {
      name: 'Black Mage',
      default: '#7e57c2'
    },

    mch: {
      name: 'Machinist',
      default: '#0097a7'
    },

    whm: {
      name: 'White Mage',
      default: '#757575'
    },

    sch: {
      name: 'Scholar',
      default: '#7986cb'
    },

    ast: {
      name: 'Astrologian',
      default: '#795548'
    },

    rdm: {
      name: 'Red Mage',
      default: '#D157C2'
    },

    sam: {
      name: 'Samurai',
      default: '#FFC623'
    }
  },

  settings (out, args) {
    settingsPartial.render(
      {
        title: 'Jobs',
        colors: exports.jobs.defaults
      },
      out
    )

    return pets.settings(out, args)
  },

  getColor (cbt, settings) {
    const type = util.jobType[cbt.Job.toLowerCase()]
    if (!type) {
      return pets.getColor(cbt, settings)
    }

    if (settings.color && settings.color[type]) {
      return settings.color[type]
    }
    return exports.job.defaults[type].default
  }
}

exports.custom = {
  name: 'By custom definition, transparent otherwise',
  getColor () {
    return 'rgba(0,0,0,0)'
  }
}

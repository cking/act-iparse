const jobType = require('../../lib/util').jobType
const util = require('./util.js')
const iconFromCombatant = util.iconFromCombatant,
  jobAbbrToLong = util.jobAbbrToLong

exports.position = {
  name: 'Position',
  description: 'Display the position in the ranking',
  enabled: true,
  options: {
    align: {
      name: 'Align',
      description: 'Set the text-alignment in the cell',
      default: 'fr',
      type: 'option',
      values: { fl: 'Left', fc: 'Center', fr: 'Right' }
    }
  },
  style: 'width: 1.5rem; max-width: 3rem',
  render (out, args) {
    out.text(`${args.index + 1}.`)
  }
}

exports.name = {
  name: 'Name',
  description: 'Display the character name',
  enabled: true,
  options: {
    align: {
      name: 'Align',
      description: 'Text align in the cell',
      default: 'fl',
      type: 'option',
      values: { fl: 'Left', fc: 'Center', fr: 'Right' }
    },
    abbr: {
      name: 'Abbreviation',
      description: 'Abbreviate the first name, last name, or both',
      default: '',
      type: 'select',
      values: { '': 'First Last', first: 'F. Last', last: 'First L.', both: 'F. L.' }
    }
  },
  render (out, args) {
    if (args.combatant.name.indexOf(' ') < 0) {
      return out.text(args.combatant.name)
    }

    let name = args.combatant.name
    let pet = name.match(/^(.*) \((\S+ \S+)\)$/)
    if (pet) {
      name = pet[0]
      pet = pet[1]
    }

    name = name.split(' ')
    switch (args.cell.opts.align) {
      case 'first':
        name[0] = name[0][0] + '.'
        break
      case 'last':
        name[1] = name[1][0] + '.'
        break
      case 'both':
        name[0] = name[0][0] + '.'
        name[1] = name[1][0] + '.'
    }

    if (pet) {
      out.text(`${pet} (${name[0]} ${name[1]})`)
    } else {
      out.text(name[0] + ' ' + name[1])
    }
  }
}

exports.job = {
  name: 'Job',
  description: 'Display the characters Job',
  enabled: true,
  options: {
    align: {
      title: 'Align',
      description: 'Text align in the cell',
      default: 'fl',
      type: 'option',
      values: { fl: 'Left', fc: 'Center', fr: 'Right' }
    },
    icon: {
      name: 'Display Icon',
      description: 'Display the class or job as an icon',
      default: true,
      type: 'checkbox'
    },
    format: {
      name: 'Format',
      description: 'Job/Class name',
      default: '',
      type: 'select',
      values: { '': 'Hidden', short: '3 Char Abbreviation', long: 'Full Class Name' }
    }
  },
  style: cell => {
    let width = 0
    switch (cell.opts.format) {
      case 'short':
        width = 3.5
        break
      case 'long':
        width = 5.5
        break
    }

    if (cell.opts.icon) {
      width += 1.5
    }

    return 'width: ' + width + 'rem'
  },
  render: (out, args) => {
    const abbr = (args.combatant.Job || args.combatant.name).toLowerCase()

    if (args.cell.opts.icon) {
      out.html(
        `<img src="/img/icons/${iconFromCombatant(
          abbr
        )}.png" style="height: 1.5rem; width: auto; position: absolute; margin-top: -0.15rem" />`
      )
      out.beginElement('span', { style: 'padding-left: 1.6rem' })
    }

    switch (args.cell.opts.format) {
      case 'short':
        out.text(args.combatant.Job.toUpperCase())
        break
      case 'long':
        out.text(jobAbbrToLong(abbr))
    }

    if (args.cell.opts.icon) {
      out.endElement()
    }
  }
}

exports.death = {
  name: 'Deaths',
  description: 'Display player deaths',
  enabled: false,
  options: {
    align: {
      name: 'Align',
      description: 'Text align in the cell',
      default: 'fc',
      type: 'option',
      values: { fl: 'Left', fc: 'Center', fr: 'Right' }
    }
  },
  style: 'width: 2rem;',
  render (out, args) {
    return out.text(args.combatant.deaths)
  }
}

exports.critall = {
  name: 'Crititcal Skill',
  description: 'Critical Heal for healers, critical hit for everyone else',
  enabled: false,
  options: {
    align: {
      name: 'Align',
      description: 'Text align in the cell',
      default: 'fr',
      type: 'option',
      values: { fl: 'Left', fc: 'Center', fr: 'Right' }
    },
    monospace: {
      name: 'Monospaced',
      description: 'Use a monospaced, fixed-width font',
      default: true,
      type: 'checkbox'
    },
    format: {
      name: 'Format',
      description: 'Display style of the crit rate',
      default: 'rel',
      type: 'option',
      values: { rel: 'In Percent', abs: 'Absolute number of hits' }
    }
  },
  style: 'width: 4rem',
  render: (out, args) => {
    if (args.cell.opts.monospace) {
      out.beginElement('span', { class: 'mono' })
    }

    if (jobType[args.combatant.Job.toLowerCase()] === 'heal') {
      if (args.cell.opts.format === 'abs') {
        out.text(args.combatant.critheals)
      } else {
        out.text(args.combatant['critheal%'])
      }
    } else {
      if (args.cell.opts.format === 'abs') {
        out.text(args.combatant.crithits)
      } else {
        out.text(args.combatant['crithit%'])
      }
    }

    if (args.cell.opts.monospace) {
      out.endElement()
    }
  }
}

exports.maxall = {
  name: 'Best Skill',
  description: 'Best Heal for healers, best hit for everyone else',
  enabled: false,
  options: {
    align: {
      description: 'Text align in the cell',
      default: 'fl',
      type: 'option',
      values: { fl: 'Left', fc: 'Center', fr: 'Right' }
    },
    style: {
      name: 'Style',
      description: 'Change display style',
      default: 'both',
      type: 'select',
      values: { both: 'Skill and Damage', skill: 'Skill', damage: 'Damage' }
    },
    round: {
      name: 'Round',
      description: 'Prefer shortened values (5k) over long values (5000)',
      default: true,
      type: 'checkbox'
    }
  },
  style (cell) {
    if (cell.opts.style == 'damage') {
      return cell.opts.round ? 'width: 4rem' : 'width: 5rem'
    }

    return 'width: 12rem'
  },
  render: (out, args) => {
    let max = args.combatant.maxhit
    if (jobType[args.combatant.Job.toLowerCase()] === 'heal') {
      max = args.combatant.maxheal
    }
    const maxSplit = max.split('-')
    let skill = maxSplit[0],
      dottedDamage = maxSplit[1]

    if (!skill) return
    if (skill.length > 15) {
      skill = skill.substr(0, 14) + '...'
    }

    let damage = (dottedDamage || '0').replace(/\./g, '')
    if (args.cell.opts.round) {
      damage = nerdRound(damage)
    }

    switch (args.cell.opts.style) {
      case 'damage':
        return out.text(damage)
      case 'skill':
        return out.text(skill)
      case 'both':
        return out.text(`${skill} (${damage})`)
    }
  }
}

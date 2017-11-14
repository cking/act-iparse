const nerdRound = require('./util').nerdRound

exports.hps = {
  name: 'HPS',
  description: 'Display the heal per second',
  enabled: true,
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
    }
  },
  style: 'flex: 0 4rem',
  render (out, args) {
    if (args.cell.opts.monospace) {
      out.beginElement('span', { class: 'mono' })
    }

    out.text(args.combatant.ENCHPS)

    if (args.cell.opts.monospace) {
      out.endElement()
    }
  }
}

exports.thps = {
  name: 'True HPS',
  description: 'Display the heal per second, adjusted to exclude the Over Heal',
  enabled: false,
  options: {
    align: {
      key: 'align',
      name: 'Align',
      description: 'Text align in the cell',
      default: 'fr',
      type: 'option',
      values: { fl: 'Left', fc: 'Center', fr: 'Right' }
    },
    monospace: {
      key: 'monospace',
      name: 'Monospaced',
      description: 'Use a monospaced, fixed-width font',
      default: true,
      type: 'checkbox'
    }
  },
  style: 'flex: 0 4rem',
  render (out, args) {
    if (args.cell.opts.monospace) {
      out.beginElement('span', { class: 'mono' })
    }

    out.text(parseInt(args.combatant.ENCHPS / 100 * (100 - parseInt(args.combatant.OverHealPct))))

    if (args.cell.opts.monospace) {
      out.endElement()
    }
  }
}

exports.heal = {
  name: 'Heal',
  description: 'Display the absolute healing done',
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
    style: {
      name: 'Style',
      description: 'Change display style',
      default: 'short',
      type: 'select',
      values: { short: 'Short (5k)', long: 'Long (5000)', percentage: 'Percantage (5%)' }
    }
  },
  style (cell) {
    if (cell.opts.style === 'long') return 'flex: 0 7rem'
    return 'flex: 0 4rem'
  },
  render (out, args) {
    if (args.cell.opts.monospace) {
      out.beginElement('span', { class: 'mono' })
    }

    let value = +args.combatant.healed
    if (args.cell.opts.style == 'short') value = nerdRound(value)
    else if (args.cell.opts.style == 'percentage') value = args.combatant['healed%']

    out.text(value)

    if (args.cell.opts.monospace) {
      out.endElement()
    }
  }
}

exports.oh = {
  name: 'Overheal',
  description: 'Display the relative overheal done',
  enabled: true,
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
    }
  },
  style: 'flex: 0 4rem',
  render: (out, args) => {
    if (args.cell.opts.monospace) {
      out.beginElement('span', { class: 'mono' })
    }

    out.text(args.combatant.OverHealPct)

    if (args.cell.opts.monospace) {
      out.endElement()
    }
  }
}

exports.maxheal = {
  name: 'Best Heal',
  description: 'Display the strongest heal',
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
      values: { both: 'Skill and Heal', skill: 'Skill', heal: 'Heal' }
    },
    round: {
      name: 'Round',
      description: 'Prefer shortened values (5k) over long values (5000)',
      default: true,
      type: 'checkbox'
    }
  },
  style (cell) {
    if (cell.opts.style == 'heal') {
      return cell.opts.round ? 'flex: 0 4rem' : 'flex: 0 5rem'
    }

    return 'flex: 0 12rem'
  },
  render: (out, args) => {
    const maxSplit = args.combatant.maxheal.split('-')
    let skill = maxSplit[0],
      dottedHeal = maxSplit[1]

    if (!skill) return
    if (skill.length > 15) {
      skill = skill.substr(0, 14) + '...'
    }

    let heal = (dottedHeal || '0').replace(/\./g, '')
    if (args.cell.opts.round) {
      heal = nerdRound(heal)
    }

    switch (args.cell.opts.style) {
      case 'heal':
        return out.text(heal)
      case 'skill':
        return out.text(skill)
      case 'both':
        return out.text(`${skill} (${heal})`)
    }
  }
}

exports.critheal = {
  name: 'Critical Heals',
  description: 'Display the critical heal rate',
  enabled: true,
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
      values: { rel: 'In Percent', abs: 'Absolute number of heals' }
    }
  },
  style: 'flex: 0 4rem',
  render: (out, args) => {
    if (args.cell.opts.monospace) {
      out.beginElement('span', { class: 'mono' })
    }

    if (args.cell.opts.format === 'abs') {
      out.text(args.combatant.critheals)
    } else {
      out.text(args.combatant['critheal%'])
    }

    if (args.cell.opts.monospace) {
      out.endElement()
    }
  }
}

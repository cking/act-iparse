exports.accuracy = {
  name: 'Accuracy',
  description: '(Deprecated) Display the relative accuracy',
  enabled: false,
  options: {
    align: {
      name: 'Align',
      description: 'Text align in the cell',
      default: 'fl',
      type: 'option',
      values: { fl: 'Left', fc: 'Center', fr: 'Right' }
    },
    monospace: {
      name: 'Monospaced',
      description: 'Use a monospaced, fixed-width font',
      default: true,
      type: 'checkbox'
    },
    reverse: {
      name: 'Missrate',
      description: 'Instead of displaying the accuracy, display the rate of misses',
      default: false,
      type: 'checkbox'
    }
  },
  style: 'flex: 0 4rem',
  render (out, args) {
    if (args.cell.opts.monospace) {
      out.beginElement('span', { class: 'mono' })
    }

    if (args.cell.opts.reverse) {
      out.text(
        parseInt(100 - parseFloat((+args.combatant.TOHIT ? args.combatant.tohit : '100').replace(',', '.'))) + '%'
      )
    } else {
      out.text((+args.combatant.TOHIT || 100) + '%')
    }

    if (args.cell.opts.monospace) {
      out.endElement()
    }
  }
}

exports.miss = {
  name: 'Number of misses',
  description: '(Deprecated) Display the number of misses',
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
    }
  },
  style: 'flex: 0 3rem',
  render (out, args) {
    if (args.cell.opts.monospace) {
      out.beginElement('span', { class: 'mono' })
    }

    out.text(args.combatant.misses)

    if (args.cell.opts.monospace) {
      out.endElement()
    }
  }
}

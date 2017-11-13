function roundRect (ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof radius === 'undefined') {
    radius = 5
  }

  if (typeof radius === typeof 1) {
    radius = {
      tr: radius,
      br: radius,
      bl: radius,
      tl: radius
    }
  }

  if (typeof stroke === 'undefined') {
    stroke = true
  }
  ctx.beginPath()
  if (radius.tl) {
    ctx.moveTo(x + radius.tl, y)
  } else {
    ctx.moveTo(x, y)
  }

  if (radius.tr) {
    ctx.lineTo(x + width - radius.tr, y)
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr)
  } else {
    ctx.lineTo(x + width, y)
  }

  if (radius.br) {
    ctx.lineTo(x + width, y + height - radius.br)
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height)
  } else {
    ctx.lineTo(x + width, y + height)
  }

  if (radius.bl) {
    ctx.lineTo(x + radius.bl, y + height)
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl)
  } else {
    ctx.lineTo(x, y + height)
  }

  if (radius.tl) {
    ctx.lineTo(x, y + radius.tl)
    ctx.quadraticCurveTo(x, y, x + radius.tl, y)
  } else {
    ctx.lineTo(x, y)
  }

  ctx.closePath()
  if (stroke) {
    ctx.stroke()
  }
  if (fill) {
    ctx.fill()
  }
}

exports.bline = {
  name: 'Line on the bottom',
  draw (ctx, cbt) {
    const w = ctx.canvas.width
    const h = ctx.canvas.height
    const perc = parseInt(cbt['damage%'])

    ctx.fillRect(0, h - 2, w / 100 * perc, 1)
  }
}

exports.tline = {
  name: 'Line on the top',
  draw (ctx, cbt) {
    const w = ctx.canvas.width
    const h = ctx.canvas.height
    const perc = parseInt(cbt['damage%'])

    ctx.fillRect(0, 1, w / 100 * perc, 1)
  }
}

exports.bar = {
  name: 'Simple Bar',
  draw (ctx, cbt) {
    const w = ctx.canvas.width
    const h = ctx.canvas.height
    const perc = parseInt(cbt['damage%'])

    ctx.fillRect(0, 0, w / 100 * perc, h)
  }
}

exports.rbar = {
  name: 'Bar rounded on the right',
  draw (ctx, cbt) {
    const w = ctx.canvas.width
    const h = ctx.canvas.height
    const perc = parseInt(cbt['damage%'])

    roundRect(ctx, 0, 0, w / 100 * perc, h, { tr: 8, br: 8 }, true, false)
  }
}

exports.fbar = {
  name: 'Bar rounded on all corners',
  draw (ctx, cbt) {
    const w = ctx.canvas.width
    const h = ctx.canvas.height
    const perc = parseInt(cbt['damage%'])

    roundRect(ctx, 0, 0, w / 100 * perc, h, 8, true, false)
  }
}

exports.transparent = {
  name: 'Transparent (hide)',
  draw () {}
}

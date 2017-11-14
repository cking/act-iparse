const util = require('../../lib/util')

exports.styles = require('./style')
exports.textures = require('./texture')
exports.colors = require('./color')

exports.render = function (ctx, cbt, settings) {
  ctx.canvas.width = ctx.canvas.clientWidth
  ctx.canvas.height = ctx.canvas.clientHeight

  const overwrite = Array.isArray(settings.overwrites)
    ? settings.overwrites.find(ow => {
      const re = new RegExp('^' + ow.search + '$', 'i')
      return combatant.name.match(re)
    })
    : false
  const color = overwrite ? overwrite.color : exports.colors[settings.cgen].getColor(cbt, settings.color || {})

  exports.textures[settings.fill].getTexture(ctx, color, cbt)
  exports.styles[settings.style].draw(ctx, cbt)
}

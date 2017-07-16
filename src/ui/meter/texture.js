"use strict"

const Color = require("color")

exports.plain = {
    name: "Plain Color",
    getTexture(ctx, color) {
        ctx.fillStyle = color
    }
}

exports.stripes = {
    name: "Striped",
    getTexture(ctx, color, cbt) {
        const tc = document.createElement("canvas")
        tc.width = 20
        tc.height = 30

        const tctx = tc.getContext("2d")
        tctx.fillStyle = Color(color).lighten(0.4).string()
        tctx.strokeStyle = Color(color).desaturate(0.6).string()
        tctx.lineWidth = 8

        tctx.fillRect(0, 0, tc.width, tc.height)

        tctx.beginPath()
        tctx.moveTo(tc.width, 0)
        tctx.lineTo(0, tc.height)

        tctx.moveTo(tc.width, -tc.height)
        tctx.lineTo(-tc.width, tc.height)

        tctx.moveTo(tc.width * 2, 0)
        tctx.lineTo(0, tc.height * 2)
        tctx.stroke()

        ctx.fillStyle = ctx.createPattern(tc, "repeat")
    }
}

exports.bubbles = {
    name: "Bubbles",
    getTexture(ctx, color, cbt) {
        const tc = document.createElement("canvas")
        tc.width = 30
        tc.height = 30

        const tctx = tc.getContext("2d")
        tctx.fillStyle = Color(color).desaturate(0.6).string()
        tctx.fillRect(0, 0, tc.width, tc.height)

        tctx.beginPath()
        tctx.arc(10, 10, 7, 0, 2 * Math.PI, false);
        tctx.arc(25, 20, 4, 0, 2 * Math.PI, false);

        tctx.fillStyle = Color(color).lighten(0.4).string()
        tctx.fill()

        ctx.fillStyle = ctx.createPattern(tc, "repeat")
    }
}

exports.vgrad = {
    name: "Vertical Gradient",
    getTexture(ctx, color, cbt) {
        const w = ctx.canvas.width
        const h = ctx.canvas.height
        const perc = parseInt(cbt["damage%"])

        const grad = ctx.createLinearGradient(0, 0, 0, h)
        grad.addColorStop(0, Color(color).lighten(0.4).string())
        grad.addColorStop(1, Color(color).desaturate(0.6).string())
        ctx.fillStyle = grad
    }
}

exports.hgrad = {
    name: "Horitzontal Gradient",
    getTexture(ctx, color, cbt) {
        const w = ctx.canvas.width
        const h = ctx.canvas.height
        const perc = parseInt(cbt["damage%"])

        const grad = ctx.createLinearGradient(0, 0, w / 100 * perc, 0)
        grad.addColorStop(0, Color(color).lighten(0.4).string())
        grad.addColorStop(1, Color(color).desaturate(0.6).string())
        ctx.fillStyle = grad
    }
}
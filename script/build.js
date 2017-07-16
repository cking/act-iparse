"use strict"

require("marko/node-require").install()

const
    fs = require("fs"),
    path = require("path"),
    lasso = require("lasso"),
    settings = require(path.join(__dirname, "../lasso.config.json")),
    overlayTemplate = require("../src/template/overlay/index.marko"),
    configTemplate = require("../src/template/config/index.marko")

if (process.env.NODE_ENV !== "production") {
    Object.assign(settings, {
        "fingerprintsEnabled": false,
        "includeSlotNames": true,
    })
}

lasso.configure(settings)
const buildDir = path.join(__dirname, "..", "build")

try {
    fs.mkdirSync(buildDir)
} catch (e) { }

overlayTemplate.render({})
.then(res => {
    const outfile = path.join(buildDir, "index.html")
    fs.writeFileSync(outfile, res.toString(), { encoding: "utf8" })
    console.log(`HTML page successfully written to "${outfile}"!`)

    return configTemplate.render({})
})
.then(res => {
    const outfile = path.join(buildDir, "config.html")
    fs.writeFileSync(outfile, res.toString(), { encoding: "utf8" })
    console.log(`HTML page successfully written to "${outfile}"!`)
})
.catch(err => console.error(err))
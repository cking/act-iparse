"use strict"

const newVersion = require("../../config").load()

require("../../components/overlay/index.marko")
    .render({newVersion})
    .then(dom => dom.appendTo(document.body))
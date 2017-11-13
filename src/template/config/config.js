const newVersion = require('../../config').load()

require('../../components/config/index.marko').render({ newVersion }).then(dom => dom.appendTo(document.body))

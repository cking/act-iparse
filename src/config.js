const newVersion = require('./lib/config').load()

document.addEventListener('DOMContentLoaded', () =>
  require('./components/config/index.marko').render({ newVersion }).then(dom => dom.appendTo(document.body))
)

const markoRouter = require('marko-router')

module.exports = class {
  onCreate () {
    this.state = {
      settings: {
        general: JSON.parse(localStorage.getItem('general')),
        header: JSON.parse(localStorage.getItem('header')),
        cells: JSON.parse(localStorage.getItem('cells')),
        meter: JSON.parse(localStorage.getItem('meter'))
      }
    }
  }

  onMount () {}

  goto (page) {
    console.log('page transition to', page)
    markoRouter.goTo(page)
  }
}

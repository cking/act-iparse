const markoRouter = require('marko-router')

module.exports = class {
  onCreate () {
    this.state = {
      settings: {
        general: JSON.parse(localStorage.getItem('general')),
        header: JSON.parse(localStorage.getItem('header')),
        cells: JSON.parse(localStorage.getItem('cells')),
        meter: JSON.parse(localStorage.getItem('meter'))
      },

      routes: [
        { path: '/', component: require('./routes/config-route-general/index.marko') },
        { path: '/table', component: require('./routes/config-route-table/index.marko') },
        { path: '/colors', component: require('./routes/config-route-colors/index.marko') },
        { path: '/about', component: require('./routes/config-route-about/index.marko') }
      ]
    }
  }

  onMount () {}

  goto (page) {
    console.log('page transition to', page)
    markoRouter.goTo(page)
  }
}

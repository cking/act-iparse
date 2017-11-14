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
        { path: '/config/', component: require('./routes/config-route-general/index.marko') },
        { path: '/config/table', component: require('./routes/config-route-table/index.marko') },
        { path: '/config/colors', component: require('./routes/config-route-colors/index.marko') },
        { path: '/config/about', component: require('./routes/config-route-about/index.marko') }
      ]
    }
  }

  onMount () {}
}

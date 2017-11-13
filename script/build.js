require('marko/node-require').install()

const fs = require('fs-extra')
const path = require('path')
const settings = require(path.join(__dirname, '../lasso.config.json'))
const overlayTemplate = require('../src/template/overlay/index.marko')
const configTemplate = require('../src/template/config/index.marko')

if (process.env.NODE_ENV !== 'production') {
  Object.assign(settings, {
    fingerprintsEnabled: false,
    includeSlotNames: true
  })
}

require('lasso').configure(settings)
const images = path.join(__dirname, '..', 'img')
const buildDir = path.join(__dirname, '..', 'build')

async function renderTemplate (template, to, data = {}) {
  const output = await template.render(data)
  return fs.writeFile(to, output.toString(), { encoding: 'utf8' })
}

async function main () {
  console.log('cleaning build dir...')
  await fs.emptyDir(buildDir)

  console.log('copying over images...')
  await fs.copy(images, buildDir)

  console.log('generating overlay page...')
  await renderTemplate(overlayTemplate, path.join(buildDir, 'index.html'))

  console.log('generating config page...')
  await fs.ensureDir(path.join(buildDir, 'config'))
  await renderTemplate(configTemplate, path.join(buildDir, 'config', 'index.html'))

  console.log('finished!')
}
main()

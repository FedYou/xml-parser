const xmlParser = require('../lib/main')

const json = {
  '@elem': 'elem',
  '@atts': { a1: false },
  '@childs': [
    {
      '@elem': 'child',
      '@childs': [{ '@elem': 'child2' }]
    }
  ]
}

const xml = xmlParser('root', json, { format: true })

console.log(xml)

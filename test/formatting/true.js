const xmlParser = require('../../lib/main')

const json = {
  '@elem': 'elem',
  '@atts': { a2: 15 },
  '@childs': [
    {
      '@elem': 'child',
      '@atts': { a1: true }
    }
  ]
}

const xml = xmlParser('root', json, { format: true })

console.log(xml)

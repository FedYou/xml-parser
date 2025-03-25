const xmlParser = require('../lib/main')

const json = [
  {
    '@elem': 'child'
  },
  {
    '@elem': 'child',
    '@atts': { a1: true }
  }
]

const xml = xmlParser('root', json, { format: true })

console.log(xml)

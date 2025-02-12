const xmlParser = require('../lib/main')

const json = {
  '@elem': 'elem',
  '@atts': { a1: true, a2: 15, a3: 'String', 'a-1': 'String' }
}

const xml = xmlParser('root', json, { format: true })

console.log(xml)

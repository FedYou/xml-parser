const xmlParse = require('../../lib')

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

const xml = xmlParse('root', json, { format: false })

console.log(xml)

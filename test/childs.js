const xmlParse = require('../lib')

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

const xml = xmlParse('root', json, { format: true })

console.log(xml)

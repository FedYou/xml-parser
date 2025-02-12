const xmlParser = require('../lib/main')

const json = {
  '@elem': 'elem',
  '@childs': [
    {
      '@elem': 'a1',
      '#': true
    },
    {
      '@elem': 'a2',
      '#': 15
    },
    {
      '@elem': 'a3',
      '#': 'String'
    },
    {
      '@elem': 'a4',
      '#': '<sub-elemetent></sub-elemetent>'
    }
  ]
}

const xml = xmlParser('root', json, { format: true })

console.log(xml)

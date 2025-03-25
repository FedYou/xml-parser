const xmlParser = require('../lib/main')

const json = [
  {
    '@': 'child', // @elem
    $: { boolean: true }, // @atts
    '&': [
      //@childs
      {
        '@': 'child', // @elems
        '#': 'text' // content
      }
    ]
  }
]

const xml = xmlParser('root', json, { format: true })

console.log(xml)

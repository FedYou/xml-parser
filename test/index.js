const xml = require('../lib')

const json = {
  '@elem': 'element',
  '@att': {
    att1: 'value',
    att2: true,
    att3: 1
  },
  '#': 10,
  '@childs': [
    {
      '@elem': 'child1'
    },
    {
      '@elem': 'child2',
      '@att': {
        att: 'value'
      }
    }
  ]
}

console.log(xml('root', json))

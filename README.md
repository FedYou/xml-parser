# Xml Parser

It converts JSON objects to xml, is lightweight, fast and simple, and does not use any dependencies.

> Works for both `commonjs` and `esmodules`.

## Use

```js
const xmlParser = require('@fedyou/xml-parser')

const json = {
  '@elem': 'elem',
  '@atts': { hidden: false, position: 20, content: 'Some text' },
  '@childs': [
    {
      '@elem': 'child',
      '#': 'text',
      // "#": 20,
      // "#": true,
      '@childs': [
        {
          '@elem': 'sub-child'
        }
      ]
    }
  ]
}

// By default the formatting is set to false
const xml = xmlParser('root', json, { format: true })

console.log(xml)
```

Result:

```xml
<?xml version='1.0' encoding='utf-8'?>
<root>
  <elem hidden='false' position='20' content='Some text'>
    <child>text
      <sub-child>
    </child>
  </elem>
</root>
```

Another way to use JSON as an array:

```js
const json = [
  {
    '@elem': 'child'
  },
  {
    '@elem': 'child',
    '@atts': { boolean: true }
  }
]
```

### Abbreviations

`@elem`: `@`

`#`: `#`

`@atts`: `$`

`@childs`: `&`

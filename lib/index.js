function validate(json) {
  if (!json && Array.isArray(json)) {
    throw new Error('Invalid JSON: expected an object')
  }
  if (!json['@elem']) {
    throw new Error('Missing required property: @elem')
  }
  if (typeof json['@elem'] !== 'string') {
    throw new Error(`@elem must be a string, got ${typeof json['@elem']}: ${json['@elem']}`)
  }

  if (json['#'] && typeof json['#'] === 'object') {
    throw new Error(`# must be a string, number or boolean, got ${typeof json['#']}: ${json['#']}`)
  }

  if (json['@att'] != null) {
    if ((json['@att'] && typeof json['@att'] !== 'object') || Array.isArray(json['@att'])) {
      throw new Error(`@att must be an object, got ${typeof json['@att']}: ${json['@att']}`)
    } else {
      for (const attKey in json['@att']) {
        if (typeof json['@att'][attKey] === 'object') {
          throw new Error(
            `@att[${attKey}] must be a string, number or boolean, got ${typeof json['@att'][
              attKey
            ]}: ${JSON.stringify(json['@att'][attKey])}`
          )
        } else if (typeof json['@att'][attKey].includes("'")) {
          throw new Error(
            `@att[${attKey}] The attribute must not contain single quotes, got ${typeof json['@att']}: ${
              json['@att'][attKey]
            }`
          )
        }
      }
    }
  }

  if (json['@childs'] && !Array.isArray(json['@childs'])) {
    throw new Error(`@childs is not an array, got ${typeof json['@childs']}: ${json['@childs']}`)
  }
}

// Replace the '<' with &lt; for the standard xml format
function formattingContent(content) {
  if (content.includes('<')) {
    return content.replace(/</g, '&lt;')
  }
}
function xmlParser(json, indent = 2, options) {
  validate(json)
  const elem = json['@elem']
  const att = json['@att'] ?? {}
  const content = json['#'] ?? ''
  const childs = json['@childs'] ?? []

  let useContent = false
  let format = options.format
  // Indent string repeats according to hierarchy level
  // The indent is used if the format is set to true
  let startStr = ''
  if (format) {
    startStr = `\n${' '.repeat(indent)}`
  }

  let xml = `${startStr}<${elem}`

  for (const attKey in att) {
    // attKey='content'
    xml += ` ${attKey}=\'${formattingContent(att[attKey])}\'`
  }

  // Closing the main label
  xml += '>'

  if (content) {
    if (format) {
      xml += '\n'
    }
    xml += formattingContent(content)
    useContent = true
  }

  if (childs.length > 0) {
    // Indent increases by 2, for each hierarchical level
    const childsParsed = childs.map((child) => xmlParser(child, indent + 2, options))
    xml += `${childsParsed.join('')}`
    useContent = true
  }
  // Adds the closing tag when it has content
  if (useContent) {
    xml += `${startStr}</${elem}>`
  }

  return xml
}

module.exports = (root, json, options = { format: false }) => {
  const xml = xmlParser(json, 2, options)
  if (!options.format) {
    return `<?xml version='1.0' encoding='utf-8'?><${root}>${xml}</${root}>`
  }
  return `<?xml version='1.0' encoding='utf-8'?>\n<${root}>${xml}\n</${root}>`
}

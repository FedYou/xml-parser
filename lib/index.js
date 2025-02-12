function err(message) {
  throw new Error(message)
}
function validateName(name) {
  if (!name.match(/^[A-Za-z0-9]+$/)) {
    err(`The element or attribute name must be a string with no special characters or spaces: ${name}`)
  }
}
function validateAtts(atts) {
  if ((atts && typeof atts !== 'object') || Array.isArray(atts)) {
    err(`@atts must be an object, got ${typeof atts}: ${atts}`)
  }
  for (const attKey in atts) {
    validateName(attKey)
    const att = atts[attKey]
    if (typeof att === 'object') {
      err(
        `@atts[${attKey}] must be a string, number or boolean, got ${typeof att}: ${JSON.stringify(att)}`
      )
    }
    if (typeof att === 'string' && att.includes("'")) {
      err(`@atts[${attKey}] The attribute must not contain single quotes, got ${typeof att}: ${att}`)
    }
  }
}
function validate(json) {
  if (!json && Array.isArray(json)) {
    err('Invalid JSON: expected an object')
  }
  if (!json['@elem']) {
    err('Missing required property: @elem')
  }
  if (typeof json['@elem'] !== 'string') {
    err(`@elem must be a string, got ${typeof json['@elem']}: ${json['@elem']}`)
  }
  validateName(json['@elem'])

  if (json['#'] && typeof json['#'] === 'object') {
    err(`# must be a string, number or boolean, got ${typeof json['#']}: ${json['#']}`)
  }

  if (json['@atts'] != null) {
    validateAtts(json['@atts'])
  }

  if (json['@childs'] && !Array.isArray(json['@childs'])) {
    throw new Error(`@childs is not an array, got ${typeof json['@childs']}: ${json['@childs']}`)
  }
}

// Replace the '<' with &lt; for the standard xml format
function formattingContent(content) {
  if (typeof content === 'string' && content.includes('<')) {
    return content.replace(/</g, '&lt;')
  }
  return content
}
function xmlParser(json, indent = 2, options) {
  validate(json)
  const elem = json['@elem']
  const att = json['@atts'] ?? {}
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
  validateName(root)
  const xml = xmlParser(json, 2, options)
  if (!options.format) {
    return `<?xml version='1.0' encoding='utf-8'?><${root}>${xml}</${root}>`
  }
  return `<?xml version='1.0' encoding='utf-8'?>\n<${root}>${xml}\n</${root}>`
}

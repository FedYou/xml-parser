function err(message) {
  throw new Error(message)
}
function validateName(name) {
  if (!name.match(/^[A-Za-z0-9-]+$/)) {
    err(`The element or attribute name must be a string with no special characters or spaces: ${name}`)
  }
}
function validateAtts(atts) {
  if ((atts && typeof atts !== 'object') || Array.isArray(atts)) {
    err(`@atts/$ must be an object, got ${typeof atts}: ${atts}`)
  }
  for (const attKey in atts) {
    validateName(attKey)
    const att = atts[attKey]
    if (typeof att === 'object') {
      err(
        `@atts/$[${attKey}] must be a string, number or boolean, got ${typeof att}: ${JSON.stringify(
          att
        )}`
      )
    }
    if (typeof att === 'string' && att.includes("'")) {
      err(`@atts/$[${attKey}] The attribute must not contain single quotes, got ${typeof att}: ${att}`)
    }
  }
}
function validate(json) {
  const elem = json['@elem'] || json['@']
  if (!json && Array.isArray(json)) {
    err('Invalid JSON: expected an object')
  }
  if (!elem) {
    err('Missing required property: @elem or @')
  }
  if (typeof elem !== 'string') {
    err(`@elem/@ must be a string, got ${typeof elem}: ${elem}`)
  }
  validateName(elem)

  if (json['#'] && typeof json['#'] === 'object') {
    err(`# must be a string, number or boolean, got ${typeof json['#']}: ${json['#']}`)
  }
  const atts = json['@atts'] || json['$']
  if (atts != null) {
    validateAtts(atts)
  }
  const childs = json['@childs'] || json['&']
  if (childs && !Array.isArray(childs)) {
    throw new Error(`@childs/& is not an array, got ${typeof childs}: ${childs}`)
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
  const elem = json['@elem'] ?? json['@']
  const att = (json['@atts'] || json['$']) ?? {}
  const content = json['#'] ?? ''
  const childs = (json['@childs'] || json['&']) ?? []

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
  if (typeof json !== 'object') {
    err('json must be an object')
  }
  let xml = ''
  if (Array.isArray(json)) {
    let indent = 2
    const childsParsed = json.map((child) => xmlParser(child, indent, options))
    xml += childsParsed.join('')
  } else {
    xml = xmlParser(json, 2, options)
  }
  if (!options.format) {
    return `<?xml version='1.0' encoding='utf-8'?><${root}>${xml}</${root}>`
  }
  return `<?xml version='1.0' encoding='utf-8'?>\n<${root}>${xml}\n</${root}>`
}

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
    throw new Error(`# must be a string or number, got ${typeof json['#']}: ${json['#']}`)
  }

  if (json['@att'] != null) {
    if ((json['@att'] && typeof json['@att'] !== 'object') || Array.isArray(json['@att'])) {
      throw new Error(`@att must be an object, got ${typeof json['@att']}: ${json['@att']}`)
    } else {
      for (const attKey in json['@att']) {
        if (typeof json['@att'][attKey] === 'object') {
          throw new Error(
            `@att[${attKey}] must be a string or number, got ${typeof json['@att'][
              attKey
            ]}: ${JSON.stringify(json['@att'][attKey])}`
          )
        }
      }
    }
  }

  if (json['@childs'] && !Array.isArray(json['@childs'])) {
    throw new Error(`@childs is not an array, got ${typeof json['@childs']}: ${json['@childs']}`)
  }
}

function xmlParser(json) {
  validate(json)
  const elem = json['@elem']
  const att = json['@att'] ?? {}
  const content = json['#'] ?? ''
  const childs = json['@childs'] ?? []
}

module.exports = (json) => {
  xmlParser(json)
}

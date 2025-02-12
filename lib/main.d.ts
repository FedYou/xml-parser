interface Options {
  /**
   * Format the xml
   * @default false
   */
  format?: boolean = false
}
/**
 * Xml parser fast and simple
 * @param root - Root element
 * @param json - Json object
 * @param options - Options
 * @returns Xml string
 */
declare function xmlPaser(root: string, json: any, options?: Options): string

export = xmlPaser
export as namespace xmlPaser

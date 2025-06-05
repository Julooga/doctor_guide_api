import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const loadMarkdown = (filePath: string) => {
  const fullPath = join(__dirname, filePath)

  return readFileSync(fullPath, 'utf-8')
}

export default loadMarkdown

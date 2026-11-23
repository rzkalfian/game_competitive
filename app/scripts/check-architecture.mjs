import { parse } from '@babel/parser'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const result = []
  for (const entry of entries) {
    const file = path.join(directory, entry.name)
    if (entry.isDirectory()) result.push(...(await walk(file)))
    else if (/\.tsx?$/.test(entry.name) && !entry.name.endsWith('.test.ts'))
      result.push(file)
  }
  return result
}
const rules = {
  domain: ['application', 'infrastructure', 'presentation', 'bootstrap'],
  application: ['infrastructure', 'presentation', 'bootstrap'],
  presentation: ['infrastructure', 'bootstrap'],
}
const failures = []
for (const file of await walk('src')) {
  const layer = file.split(path.sep)[1]
  const source = parse(await readFile(file, 'utf8'), {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
  })
  for (const statement of source.program.body) {
    if (statement.type !== 'ImportDeclaration') continue
    const dependency = statement.source.value
    const target = dependency.startsWith('.')
      ? path
          .relative('src', path.resolve(path.dirname(file), dependency))
          .split(path.sep)[0]
      : dependency
    if (
      rules[layer]?.includes(target) ||
      (['domain', 'application'].includes(layer) && !dependency.startsWith('.'))
    )
      failures.push(`${file}: ${dependency}`)
  }
}
if (failures.length) throw new Error(failures.join('\n'))
console.log('PASS: domain, application, and presentation import boundaries.')

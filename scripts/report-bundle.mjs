import fs from 'fs'
import path from 'path'
import vm from 'vm'

function loadRscManifest(filePath) {
  const code = fs.readFileSync(filePath, 'utf8')
  const context = { globalThis: {} }
  vm.createContext(context)
  vm.runInContext(code, context, { filename: filePath })
  return context.globalThis.__RSC_MANIFEST ?? {}
}

function calcFirstLoadBytes(manifestEntry) {
  const chunks = new Set()
  for (const mod of Object.values(manifestEntry.clientModules ?? {})) {
    for (const c of mod.chunks ?? []) {
      if (typeof c === 'string' && c.startsWith('static/chunks/') && c.endsWith('.js')) chunks.add(c)
    }
  }

  let total = 0
  for (const c of chunks) {
    const diskPath = path.join('.next', ...c.split('/'))
    if (fs.existsSync(diskPath)) total += fs.statSync(diskPath).size
  }

  return { total, chunkCount: chunks.size }
}

const routes = [
  { label: '/', key: '/page', file: '.next/server/app/page_client-reference-manifest.js' },
  { label: '/forecast', key: '/forecast/page', file: '.next/server/app/forecast/page_client-reference-manifest.js' },
]

const results = []
for (const r of routes) {
  const manifest = loadRscManifest(r.file)
  const entry = manifest[r.key]
  if (!entry) continue
  const { total, chunkCount } = calcFirstLoadBytes(entry)
  results.push({ route: r.label, firstLoadBytes: total, chunkCount })
}

const totalFirstLoadBytes = Math.max(...results.map((r) => r.firstLoadBytes), 0)

console.log(JSON.stringify({ totalFirstLoadBytes, routes: results }, null, 2))


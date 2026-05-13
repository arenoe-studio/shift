import fs from 'fs'
import path from 'path'

const stats = JSON.parse(fs.readFileSync('.next/diagnostics/route-bundle-stats.json', 'utf8'))

function normalizeDiskPath(p) {
  return p.replaceAll('\\\\', path.sep).replaceAll('/', path.sep)
}

function safeSize(p) {
  try {
    return fs.statSync(p).size
  } catch {
    return 0
  }
}

const routes = stats
  .filter((r) => r.route === '/' || r.route === '/forecast')
  .map((r) => {
    const chunkPaths = (r.firstLoadChunkPaths ?? []).map(normalizeDiskPath)
    const totalBytes = chunkPaths.reduce((sum, p) => sum + safeSize(p), 0)
    return { route: r.route, firstLoadBytes: totalBytes, chunkCount: chunkPaths.length }
  })
  .sort((a, b) => b.firstLoadBytes - a.firstLoadBytes)

console.log(JSON.stringify({ routes }, null, 2))


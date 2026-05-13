import fs from 'fs'
import path from 'path'

const stats = JSON.parse(fs.readFileSync('.next/diagnostics/route-bundle-stats.json', 'utf8'))

function sizeOf(p) {
  const normalized = p.replaceAll('\\\\', path.sep).replaceAll('/', path.sep)
  const diskPath = normalized.startsWith('.next') ? normalized : path.join(normalized)
  try {
    return fs.statSync(diskPath).size
  } catch {
    return null
  }
}

const byRoute = stats.map((r) => {
  const chunks = (r.firstLoadChunkPaths ?? [])
    .map((p) => ({ path: p, size: sizeOf(p) }))
    .filter((c) => typeof c.size === 'number')
    .sort((a, b) => b.size - a.size)
  return { route: r.route, firstLoadUncompressedJsBytes: r.firstLoadUncompressedJsBytes, chunks }
})

byRoute.sort((a, b) => (b.firstLoadUncompressedJsBytes ?? 0) - (a.firstLoadUncompressedJsBytes ?? 0))
const worst = byRoute[0]

console.log(JSON.stringify({ worstRoute: worst.route, top5FirstLoadChunks: worst.chunks.slice(0, 5) }, null, 2))


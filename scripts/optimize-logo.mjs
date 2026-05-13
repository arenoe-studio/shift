import sharp from 'sharp'
import { existsSync, mkdirSync } from 'fs'

if (!existsSync('public')) mkdirSync('public')

await sharp('components/logo/S+ White.png')
  .webp({ quality: 90, lossless: false })
  .toFile('public/logo.webp')

console.log('Logo converted to public/logo.webp')


#!/usr/bin/env bun

import { mkdir, readdir } from 'fs/promises'
import { BygAd } from '@bygnet/types'

async function main(): Promise<void> {
  const baseUrl: string = process.env.BASE_URL

  if (!baseUrl) {
    console.error('BASE_URL environment variable is not set')
    process.exit(1)
  }

  // Create dist folder
  await mkdir('dist', { recursive: true })

  // Read ads folder
  const files: string[] = await readdir('ads')
  const jpgFiles: string[] = files.filter((f: string): boolean =>
    f.endsWith('.jpg')
  )

  // Build index
  const ads: BygAd[] = jpgFiles.map(
    (f: string): BygAd => ({
      name: f.replace('.jpg', ''),
      image: `${baseUrl}/${f}`,
    })
  )

  // Write index.json
  await Bun.write('dist/index.json', JSON.stringify(ads, null, 2))

  // Copy files
  for (const f of jpgFiles) {
    const content: ArrayBuffer = await Bun.file(`ads/${f}`).arrayBuffer()
    await Bun.write(`dist/${f}`, content)
  }

  console.log('Build complete')
}

main().catch(console.error)

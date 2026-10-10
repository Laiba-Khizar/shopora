import fs from 'fs'

export const products = JSON.parse(
  fs.readFileSync(new URL('./data/products.json', import.meta.url), 'utf-8'),
)
import fs from 'fs'

const res = await fetch('https://dummyjson.com/products?limit=100')

if (!res.ok) {
  console.log('Download failed. Check your internet connection.')
  process.exit(1)
}

const data = await res.json()

fs.mkdirSync('data', { recursive: true })
fs.writeFileSync('data/products.json', JSON.stringify(data.products, null, 2))

console.log(`Saved ${data.products.length} products to data/products.json`)
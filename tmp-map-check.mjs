const url = 'https://share.google/f9SSP2QCe7C3P3wn5'
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
const res = await fetch(url, {
  redirect: 'follow',
  headers: { 'User-Agent': UA, Accept: 'text/html' },
})
const html = await res.text()
console.log('final', res.url)
console.log('status', res.status)
console.log('has maps/place', /maps\/place/i.test(html))
console.log('has maps.app', /maps\.app\.goo\.gl/i.test(html))
console.log('has @coords', /@-?\d+\.\d+,-?\d+\.\d+/.test(html))
console.log('has !3d', /!3d-?\d/.test(html))

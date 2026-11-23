import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'

const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="#f9d665"/><g stroke="#24463d" stroke-width="12" stroke-linejoin="round"><path d="M102 236h126l14 139H88Z" fill="#3b82f6"/><path d="M284 236h126l14 139H270Z" fill="#ef4444"/><circle cx="166" cy="179" r="55" fill="#e9ab7c"/><circle cx="348" cy="179" r="55" fill="#e9ab7c"/><path d="M114 166q8-77 101-9l-39-27-16 15-24-8ZM296 166q8-77 101-9l-39-27-16 15-24-8Z" fill="#24463d"/><path d="m154 181 1 2m24-2 1 2m-26 14q13 13 26 0m155-16 1 2m24-2 1 2m-26 14q13 13 26 0" fill="none" stroke-linecap="round"/><path d="M86 401h340" stroke-linecap="round"/></g></svg>`
await mkdir('public/icons', { recursive: true })
for (const size of [192, 512])
  await sharp(Buffer.from(icon))
    .resize(size, size)
    .png()
    .toFile(`public/icons/icon-${size}.png`)
await sharp(Buffer.from(icon))
  .resize(512, 512)
  .png()
  .toFile('public/icons/maskable-512.png')
console.log('Rendered local PWA icons: 192, 512, and maskable 512.')

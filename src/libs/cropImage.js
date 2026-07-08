// Target output size for ad media (Large Quarter-Page Banner).
export const AD_MEDIA_WIDTH = 1080
export const AD_MEDIA_HEIGHT = 395
export const AD_MEDIA_ASPECT = AD_MEDIA_WIDTH / AD_MEDIA_HEIGHT

const createImage = (url) =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (err) => reject(err))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

/**
 * Draw the selected crop region onto a fixed 1080x395 canvas and return the
 * result as a File (+ an object URL for preview).
 *
 * @param {string} imageSrc   - source image (data URL / object URL)
 * @param {{x:number,y:number,width:number,height:number}} pixelCrop - crop area in source pixels
 * @param {string} [fileName]
 * @returns {Promise<{ file: File, url: string }>}
 */
export async function getCroppedImageFile(
  imageSrc,
  pixelCrop,
  fileName = 'ad-media.jpg',
) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  canvas.width = AD_MEDIA_WIDTH
  canvas.height = AD_MEDIA_HEIGHT
  const ctx = canvas.getContext('2d')

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    AD_MEDIA_WIDTH,
    AD_MEDIA_HEIGHT,
  )

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to crop image'))
          return
        }
        const file = new File([blob], fileName, { type: 'image/jpeg' })
        resolve({ file, url: URL.createObjectURL(blob) })
      },
      'image/jpeg',
      0.92,
    )
  })
}

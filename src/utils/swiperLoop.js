/**
 * Swiper loop needs enough slides; otherwise it logs warnings and glitches.
 * Rule: at least twice slidesPerView (min 2 slides).
 */
export function swiperCanLoop(slideCount, slidesPerView = 1) {
  const count = Number(slideCount) || 0
  const perView = Math.max(1, Number(slidesPerView) || 1)
  return count > 1 && count >= perView * 2
}

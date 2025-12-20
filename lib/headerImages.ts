// List of available header background images
export const headerImages = [
  "/images/header_backgrounds/camaro.jpg",
  "/images/header_backgrounds/camaro_front.jpg",
  "/images/header_backgrounds/ferrari_front_close.jpg",
  "/images/header_backgrounds/mercedes_interior.jpg",
  "/images/header_backgrounds/porsche_356_corner.jpg",
  "/images/header_backgrounds/porsche_356_interior.jpg",
  "/images/header_backgrounds/porsche_front.jpg",
  "/images/header_backgrounds/rolls_royce_interior.jpg",
];

export function getRandomHeaderImage(): string {
  return headerImages[Math.floor(Math.random() * headerImages.length)];
}

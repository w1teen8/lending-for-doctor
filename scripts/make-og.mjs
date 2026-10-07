// One-off: builds public/og.jpg (1200×630) from the hero photo. Re-run after changing the headline.
import sharp from "sharp";

const W = 1200;
const H = 630;
const title = ["Два дні практики.", "Після них ви знаєте, що робити", "до приїзду швидкої."];

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const svg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#111a1c" fill-opacity="0.78"/>
  <text x="64" y="96" font-family="Arial, Helvetica, sans-serif" font-size="26" font-weight="700" fill="#9aa39f" letter-spacing="2">КУРС ТАКТИЧНОЇ МЕДИЦИНИ · АНДРІЙ КРАВЕЦЬ</text>
  <text x="64" y="300" font-family="Arial, Helvetica, sans-serif" font-size="92" font-weight="700" fill="#e9ebe6">${esc(title[0])}</text>
  <text x="64" y="380" font-family="Arial, Helvetica, sans-serif" font-size="50" font-weight="700" fill="#e9ebe6">${esc(title[1])}</text>
  <text x="64" y="442" font-family="Arial, Helvetica, sans-serif" font-size="50" font-weight="700" fill="#e9ebe6">${esc(title[2])}</text>
  <rect x="64" y="510" width="210" height="64" fill="#e9ebe6"/>
  <text x="84" y="557" font-family="Arial, Helvetica, sans-serif" font-size="44" font-weight="700" fill="#c1272d">04:00</text>
</svg>`;

await sharp("photos/hero.jpg")
  .resize(W, H, { fit: "cover", position: "centre" })
  .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
  .jpeg({ quality: 82, mozjpeg: true })
  .toFile("public/og.jpg");

console.log("public/og.jpg");

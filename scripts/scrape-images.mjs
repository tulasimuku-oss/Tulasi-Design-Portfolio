const pages = {
  "namma-metro": "service-design-namma-metro",
  "whatsapp-forums": "whatsapp-forums-internship-at-digital-impact-square",
  "library-management": "library-management-system",
  caelum: "caelum-technocentric-project",
  liveasy: "ux-internship-liveasy-logistics",
  "myco-interiors": "start-up-systems-myco-interiors",
  "upi-device": "upi-device-payper",
  "miyazaki-tribute": "tribute-website-hayao-miyazaki",
  "smileys-journey": "animation",
  "display-podium": "product-display-podium",
  "vector-illustrations": "flat-vector-character-design",
  logofolio: "logofolio",
};

function pickImages(html) {
  const re =
    /https:\/\/cdn\.myportfolio\.com\/0fb6fb61-828c-4e94-9246-e9e9754c08ef\/([a-f0-9-]+)(?:_rw_(\d+)|(_rwc_[^"?]+)|(_carw_[^"?]+))?\.(jpg|jpeg|png|webp)(\?[^"\s>]*)?/gi;
  const byId = new Map();
  let m;
  while ((m = re.exec(html)) !== null) {
    const id = m[1];
    const rw = m[2] ? parseInt(m[2], 10) : 0;
    const special = m[3] || m[4] || "";
    const query = m[6] || "";
    if (special.includes("carw") || special.endsWith("x32")) continue;
    const url = m[0];
    const score = rw || (special ? 800 : 1000);
    const existing = byId.get(id);
    if (!existing || score > existing.score) byId.set(id, { url, score });
  }
  return [...byId.values()]
    .sort((a, b) => b.score - a.score)
    .map((v) => v.url);
}

(async () => {
  const out = {};
  for (const [slug, path] of Object.entries(pages)) {
    const res = await fetch(`https://tmukunda.myportfolio.com/${path}`);
    const html = await res.text();
    out[slug] = pickImages(html);
    console.log(`${slug}: ${out[slug].length} — ${out[slug][0]?.substring(0, 80)}...`);
  }
  const fs = await import("fs");
  fs.writeFileSync(
    "src/data/project-images.json",
    JSON.stringify(out, null, 2),
  );
})();

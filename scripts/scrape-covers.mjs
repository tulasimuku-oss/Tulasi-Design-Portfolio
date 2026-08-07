const mapping = {
  "namma-metro": "service-design-namma-metro",
  "whatsapp-forums": "whatsapp-forums-internship-at-digital-impact-square",
  "library-management": "library-management-system",
  caelum: "caelum-technocentric-project",
  liveasy: "ux-internship-liveasy-logistics",
  "myco-interiors": "start-up-systems-myco-interiors",
  "upi-device": "upi-device-payper",
  "miyazaki-tribute": "tribute-website-hayao-miyazaki",
};

const collections = {
  ux: "design-focussed-projects-1",
  ui: "design-projects",
};

function pickCoverFromProjectPage(html) {
  const rwc = [
    ...html.matchAll(
      /https:\/\/cdn\.myportfolio\.com\/0fb6fb61-828c-4e94-9246-e9e9754c08ef\/([a-f0-9-]+)_rwc_[^"'\s>]+\.(?:png|jpg|jpeg|webp)\?h=[^"'\s>]+/gi,
    ),
  ].map((m) => m[0]);

  const byId = new Map();
  for (const url of rwc) {
    const id = url.match(/\/([a-f0-9-]+)_rwc/)?.[1];
    if (!id) continue;
    const width = Number(url.match(/x(\d+)\.(?:png|jpg|jpeg|webp)/i)?.[1] || 0);
    const existing = byId.get(id);
    if (!existing || width > existing.width) byId.set(id, { url, width });
  }

  const sorted = [...byId.values()].sort((a, b) => b.width - a.width);
  return sorted[0]?.url ?? null;
}

async function pickCoverFromCollection(collectionPath, projectPath) {
  const html = await (await fetch(`https://tmukunda.myportfolio.com/${collectionPath}`)).text();
  const linkRe = new RegExp(
    `href=\"(?:https://tmukunda\\.myportfolio\\.com/)?${projectPath}\"[^>]*>[\\s\\S]*?(<img[^>]+>)`,
    "i",
  );
  const section = html.split(projectPath)[0]?.slice(-4000) + html.split(projectPath)[1]?.slice(0, 4000);
  const imgs = [
    ...section.matchAll(
      /https:\/\/cdn\.myportfolio\.com\/0fb6fb61-828c-4e94-9246-e9e9754c08ef\/[a-f0-9-]+_rwc_[^"'\s>]+\.(?:png|jpg|jpeg|webp)\?h=[^"'\s>]+/gi,
    ),
  ].map((m) => m[0]);
  if (imgs.length) {
    imgs.sort((a, b) => {
      const aw = Number(a.match(/x(\d+)\./i)?.[1] || 0);
      const bw = Number(b.match(/x(\d+)\./i)?.[1] || 0);
      return bw - aw;
    });
    return imgs[0];
  }
  return null;
}

(async () => {
  const out = {};
  for (const [slug, path] of Object.entries(mapping)) {
    const html = await (await fetch(`https://tmukunda.myportfolio.com/${path}`)).text();
    let cover = pickCoverFromProjectPage(html);

    if (!cover) {
      const collection =
        slug === "liveasy" ||
        slug === "caelum" ||
        slug === "myco-interiors" ||
        slug === "upi-device" ||
        slug === "miyazaki-tribute"
          ? collections.ui
          : collections.ux;
      cover = await pickCoverFromCollection(collection, path);
    }

    out[slug] = cover;
    console.log(`${slug}: ${cover ?? "NOT FOUND"}`);
  }

  const fs = await import("fs");
  fs.writeFileSync("src/data/project-covers.json", JSON.stringify(out, null, 2));
})();

const collections = {
  "design-focussed-projects-1": {
    "whatsapp-forums-internship-at-digital-impact-square": "whatsapp-forums",
    "service-design-namma-metro": "namma-metro",
    "library-management-system": "library-management",
  },
  "design-projects": {
    "caelum-technocentric-project": "caelum",
    "ux-internship-liveasy-logistics": "liveasy",
    "start-up-systems-myco-interiors": "myco-interiors",
    "upi-device-payper": "upi-device",
    "tribute-website-hayao-miyazaki": "miyazaki-tribute",
  },
};

function extractLinkImages(html) {
  const results = [];
  const linkRe =
    /href="(?:https:\/\/tmukunda\.myportfolio\.com\/)?([^"#?]+)"[^>]*>[\s\S]*?<img[^>]+src="(https:\/\/cdn\.myportfolio\.com[^"]+)"/gi;
  let m;
  while ((m = linkRe.exec(html)) !== null) {
    results.push({ path: m[1], img: m[2] });
  }
  return results;
}

function bestResolution(url) {
  return url.replace(/x32\.(jpg|png)/i, "x1920.$1").replace(/x640\./, "x1920.");
}

(async () => {
  const covers = {};

  // Namma Metro: use the branded cover from homepage / project tile
  covers["namma-metro"] =
    "https://cdn.myportfolio.com/0fb6fb61-828c-4e94-9246-e9e9754c08ef/35e3404c-6f9a-4895-bcf8-84b8a6af13b2_rwc_25x0x1875x1080x4096.png?h=c065633311634c3937f61b8bd155f01a";

  for (const [collection, slugMap] of Object.entries(collections)) {
    const html = await (
      await fetch(`https://tmukunda.myportfolio.com/${collection}`)
    ).text();
    const links = extractLinkImages(html);

    for (const { path, img } of links) {
      const slug = slugMap[path];
      if (slug) {
        covers[slug] = bestResolution(img);
        console.log(`${slug} <- ${path}`);
        console.log(`  ${covers[slug]}`);
      }
    }
  }

  const fs = await import("fs");
  fs.writeFileSync(
    "src/data/project-covers.json",
    JSON.stringify(covers, null, 2),
  );
  console.log("\nDone:", Object.keys(covers).length, "covers");
})();

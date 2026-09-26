// Synchronise la liste des champions et leurs portraits avec Data Dragon (CDN officiel de Riot).
// Usage : npm run sync-champions
// - écrit src/lib/champions.ts (id Riot, identifiant Data Dragon, nom français)
// - écrit src/lib/championImages.ts (require() statiques : Metro doit connaître chaque image)
// - télécharge les portraits manquants dans assets/champions/<identifiant>.png
// - supprime les portraits des champions qui n'existent plus
// Même logique que scripts/sync-champions.mjs du site SvelteKit (lol-random-arena).
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const imagesDir = join(root, "assets", "champions");
const CDN = "https://ddragon.leagueoflegends.com";
const HEADER = "// Généré par scripts/sync-champions.mjs depuis Data Dragon";

async function getJson(url) {
	const response = await fetch(url);
	if (!response.ok) throw new Error(`${url} -> HTTP ${response.status}`);
	return response.json();
}

const [version] = await getJson(`${CDN}/api/versions.json`);
const { data } = await getJson(`${CDN}/cdn/${version}/data/fr_FR/champion.json`);

const champions = Object.values(data)
	.map((c) => ({ id: Number(c.key), slug: c.id, name: c.name }))
	.sort((a, b) => a.id - b.id);

writeFileSync(
	join(root, "src", "lib", "champions.ts"),
	`${HEADER} ${version} : ne pas modifier à la main.

export type Champion = {
	/** Clé numérique Riot (stable, utilisée par op.gg). */
	id: number;
	/** Identifiant Data Dragon, aussi nom du portrait dans assets/champions. */
	slug: string;
	/** Nom affiché, en français. */
	name: string;
};

export const CHAMPIONS_VERSION = "${version}";

export const CHAMPIONS: readonly Champion[] = [
${champions.map((c) => `\t{ id: ${c.id}, slug: ${JSON.stringify(c.slug)}, name: ${JSON.stringify(c.name)} },`).join("\n")}
];
`,
);

writeFileSync(
	join(root, "src", "lib", "championImages.ts"),
	`${HEADER} ${version} : ne pas modifier à la main.
import type { ImageSourcePropType } from "react-native";

export const CHAMPION_IMAGES: Record<string, ImageSourcePropType> = {
${champions.map((c) => `\t${JSON.stringify(c.slug)}: require("../../assets/champions/${c.slug}.png"),`).join("\n")}
};
`,
);

mkdirSync(imagesDir, { recursive: true });
const wanted = new Set(champions.map((c) => `${c.slug}.png`));
let downloaded = 0;
for (const c of champions) {
	const file = join(imagesDir, `${c.slug}.png`);
	if (existsSync(file)) continue;
	const response = await fetch(`${CDN}/cdn/${version}/img/champion/${c.slug}.png`);
	if (!response.ok) throw new Error(`portrait ${c.slug} -> HTTP ${response.status}`);
	writeFileSync(file, Buffer.from(await response.arrayBuffer()));
	downloaded++;
}
const removed = readdirSync(imagesDir).filter((f) => f.endsWith(".png") && !wanted.has(f));
for (const f of removed) rmSync(join(imagesDir, f));

console.log(
	`Data Dragon ${version} : ${champions.length} champions, ${downloaded} portrait(s) téléchargé(s), ${removed.length} supprimé(s).`,
);

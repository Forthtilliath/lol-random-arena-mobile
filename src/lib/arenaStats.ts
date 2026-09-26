import type { Criteria } from "@/constants/game";
import type { Champion } from "@/lib/champions";

export type ChampionWithRates = {
	/** Clé numérique Riot, la même que `Champion["id"]`. */
	id: number;
	name: string;
	/** Taux de sélection, entre 0 et 1. */
	popularity: number;
	/** Taux de victoire, entre 0 et 1. */
	winrate: number;
};

export const ARENA_STATS_URL = "https://www.op.gg/lol/modes/arena";

// op.gg est une app Next.js : la tier list Arena est embarquée dans le payload RSC de la page sous
// forme d'objets JSON échappés, ex. {"key":"aatrox","name":"Aatrox",...,"id":266,"win_rate":0.45,
// "pick_rate":0.08}. Même extraction que sur le site SvelteKit.
const CHAMPION_OBJECT = /\{"key":"[a-z0-9]+","name":"[^"]*"[^{}]*\}/g;

type StatsEntry = { id: number; name: string; win_rate: number; pick_rate: number };

function isStatsEntry(value: unknown): value is StatsEntry {
	if (typeof value !== "object" || value === null) return false;
	const entry = value as Record<string, unknown>;
	return (
		typeof entry.id === "number" &&
		typeof entry.name === "string" &&
		typeof entry.win_rate === "number" &&
		typeof entry.pick_rate === "number"
	);
}

/** Extrait le taux de sélection et de victoire de chaque champion d'une page Arena op.gg. */
export function parseArenaStats(html: string): ChampionWithRates[] {
	const unescaped = html.replace(/\\"/g, '"');
	const byId = new Map<number, ChampionWithRates>();

	for (const [raw] of unescaped.matchAll(CHAMPION_OBJECT)) {
		let parsed: unknown;
		try {
			parsed = JSON.parse(raw);
		} catch {
			continue;
		}
		if (!isStatsEntry(parsed) || byId.has(parsed.id)) continue;
		byId.set(parsed.id, {
			id: parsed.id,
			name: parsed.name,
			popularity: parsed.pick_rate,
			winrate: parsed.win_rate,
		});
	}

	return [...byId.values()];
}

/** Récupère les stats Arena actuelles d'op.gg. Lève une erreur si la page est illisible. */
export async function fetchArenaStats(fetchFn: typeof fetch = fetch): Promise<ChampionWithRates[]> {
	const response = await fetchFn(ARENA_STATS_URL, { headers: { "Accept-Language": "en" } });
	if (!response.ok) throw new Error(`op.gg a répondu HTTP ${response.status}`);

	const stats = parseArenaStats(await response.text());
	if (stats.length === 0) throw new Error("Aucune statistique Arena trouvée sur op.gg");
	return stats;
}

function positions(champions: ChampionWithRates[]): Map<number, number> {
	return new Map(champions.map((champion, index) => [champion.id, index]));
}

/** Trie les champions du premier à bannir au dernier, selon `criteria`. */
export function rankChampions(
	champions: ChampionWithRates[],
	criteria: Criteria,
): ChampionWithRates[] {
	if (criteria === "popularity") return [...champions].sort((a, b) => b.popularity - a.popularity);
	if (criteria === "winrate") return [...champions].sort((a, b) => b.winrate - a.winrate);

	// Taux de sélection (~0,1) et de victoire (~0,5) n'ont pas la même échelle : les additionner
	// laisserait la victoire dominer. Additionner les rangs dans les deux classements les pondère
	// à égalité.
	const byPopularity = positions(rankChampions(champions, "popularity"));
	const byWinrate = positions(rankChampions(champions, "winrate"));
	const score = (c: ChampionWithRates) => byPopularity.get(c.id)! + byWinrate.get(c.id)!;

	return [...champions].sort((a, b) => score(a) - score(b));
}

/** Retire de `champions` les `count` premiers du classement op.gg. */
export function removeBanned(
	champions: readonly Champion[],
	stats: ChampionWithRates[],
	criteria: Criteria,
	count: number,
): Champion[] {
	const banned = new Set(
		rankChampions(stats, criteria)
			.slice(0, count)
			.map((c) => c.id),
	);
	return champions.filter((champion) => !banned.has(champion.id));
}

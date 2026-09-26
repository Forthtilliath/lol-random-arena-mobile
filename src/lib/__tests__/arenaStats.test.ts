import {
	ARENA_STATS_URL,
	fetchArenaStats,
	parseArenaStats,
	rankChampions,
	removeBanned,
} from "@/lib/arenaStats";

// Imite le payload RSC d'op.gg : objets JSON aux guillemets échappés, champions répétés.
const HTML = String.raw`
<script>self.__next_f.push([1,"[{\"key\":\"aatrox\",\"name\":\"Aatrox\",\"id\":266,\"win_rate\":0.45,\"pick_rate\":0.08},{\"key\":\"ahri\",\"name\":\"Ahri\",\"id\":103,\"win_rate\":0.55,\"pick_rate\":0.11}]"])</script>
<script>self.__next_f.push([1,"[{\"key\":\"aatrox\",\"name\":\"Aatrox\",\"id\":266,\"win_rate\":0.99,\"pick_rate\":0.99}]"])</script>
<script>self.__next_f.push([1,"{\"key\":\"menu\",\"name\":\"Stats\",\"label\":\"pas un champion\"}"])</script>
`;

const response = (body: string, status = 200) =>
	({ ok: status < 400, status, text: async () => body }) as Response;

describe("parseArenaStats", () => {
	it("extracts each champion once, from its first occurrence", () => {
		expect(parseArenaStats(HTML)).toEqual([
			{ id: 266, name: "Aatrox", popularity: 0.08, winrate: 0.45 },
			{ id: 103, name: "Ahri", popularity: 0.11, winrate: 0.55 },
		]);
	});

	it("returns an empty array on a Cloudflare challenge page", () => {
		expect(parseArenaStats("<title>Just a moment...</title>")).toEqual([]);
	});
});

describe("fetchArenaStats", () => {
	it("fetches and parses the op.gg Arena page", async () => {
		const fetchFn = jest.fn(async () => response(HTML));
		expect(await fetchArenaStats(fetchFn as unknown as typeof fetch)).toHaveLength(2);
		expect(fetchFn).toHaveBeenCalledWith(ARENA_STATS_URL, expect.anything());
	});

	it("throws on an HTTP error", async () => {
		const fetchFn = jest.fn(async () => response("blocked", 403));
		await expect(fetchArenaStats(fetchFn as unknown as typeof fetch)).rejects.toThrow("HTTP 403");
	});

	it("throws when the page has no stats", async () => {
		const fetchFn = jest.fn(async () => response("<p>rien</p>"));
		await expect(fetchArenaStats(fetchFn as unknown as typeof fetch)).rejects.toThrow(
			"Aucune statistique",
		);
	});
});

describe("rankChampions / removeBanned", () => {
	const stats = [
		{ id: 1, name: "A", popularity: 0.1, winrate: 0.6 },
		{ id: 2, name: "B", popularity: 0.3, winrate: 0.4 },
		{ id: 3, name: "C", popularity: 0.2, winrate: 0.55 },
	];
	const champions = stats.map(({ id, name }) => ({ id, slug: name, name }));

	it("sorts by popularity or win rate", () => {
		expect(rankChampions(stats, "popularity").map((c) => c.name)).toEqual(["B", "C", "A"]);
		expect(rankChampions(stats, "winrate").map((c) => c.name)).toEqual(["A", "C", "B"]);
	});

	it("weighs both rankings equally in mixed mode", () => {
		// Rangs (popularité + victoire) : A = 2 + 0, B = 0 + 2, C = 1 + 1 -> égalité, ordre conservé
		expect(rankChampions(stats, "mixed").map((c) => c.name)).toEqual(["A", "B", "C"]);
	});

	it("removes the top champions of the ranking", () => {
		expect(removeBanned(champions, stats, "winrate", 2).map((c) => c.name)).toEqual(["B"]);
	});
});

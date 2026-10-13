import { CHAMPIONS } from "@/lib/champions";
import { DEFAULT_CONFIG } from "@/lib/configSchema";
import { type DrawConfig, drawTeams, getPlayerNames } from "@/lib/draw";

const config = (patch: Partial<DrawConfig> = {}): DrawConfig => ({ ...DEFAULT_CONFIG, ...patch });

describe("getPlayerNames", () => {
	it("keeps only the players of the chosen setup", () => {
		expect(getPlayerNames(config({ setup: "duo" }))).toHaveLength(16);
		expect(getPlayerNames(config({ setup: "trio" }))).toHaveLength(18);
	});

	it("falls back to « Joueur N » for blank names", () => {
		const players = [...DEFAULT_CONFIG.players];
		players[2] = "   ";
		expect(getPlayerNames(config({ players }))[2]).toBe("Joueur 3");
	});

	it("trims names", () => {
		const players = [...DEFAULT_CONFIG.players];
		players[0] = "  Faker ";
		expect(getPlayerNames(config({ players }))[0]).toBe("Faker");
	});
});

describe("drawTeams", () => {
	it("forms 8 duos or 6 trios", () => {
		expect(drawTeams(config({ setup: "duo" }), CHAMPIONS).map((t) => t.length)).toEqual(
			Array(8).fill(2),
		);
		expect(drawTeams(config({ setup: "trio" }), CHAMPIONS).map((t) => t.length)).toEqual(
			Array(6).fill(3),
		);
	});

	it("never picks the same champion twice", () => {
		for (let run = 0; run < 50; run++) {
			const ids = drawTeams(config({ setup: "trio" }), CHAMPIONS)
				.flat()
				.map((p) => p.champion.id);
			expect(new Set(ids).size).toBe(ids.length);
		}
	});

	it("only picks champions from the given pool", () => {
		const pool = CHAMPIONS.slice(0, 20);
		const ids = new Set(pool.map((c) => c.id));
		for (const player of drawTeams(config(), pool).flat()) {
			expect(ids.has(player.champion.id)).toBe(true);
		}
	});

	it("keeps the registration order when teams are not random", () => {
		const names = drawTeams(config({ randomTeams: false }), CHAMPIONS).map((team) =>
			team.map((p) => p.name),
		);
		expect(names[0]).toEqual(["Joueur 1", "Joueur 2"]);
		expect(names[7]).toEqual(["Joueur 15", "Joueur 16"]);
	});

	it("throws when the pool is too small", () => {
		expect(() => drawTeams(config(), CHAMPIONS.slice(0, 10))).toThrow("Pas assez de champions");
	});
});

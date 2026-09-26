import { DEFAULT_CONFIG, parseConfig } from "@/lib/configSchema";

describe("parseConfig", () => {
	it("returns the defaults for an empty value", () => {
		expect(parseConfig(undefined)).toEqual(DEFAULT_CONFIG);
		expect(parseConfig({})).toEqual(DEFAULT_CONFIG);
	});

	it("keeps valid fields and replaces invalid ones", () => {
		const config = parseConfig({ setup: "trio", autoBanCount: 9999, criteria: "nope" });
		expect(config.setup).toBe("trio");
		expect(config.autoBanCount).toBe(DEFAULT_CONFIG.autoBanCount);
		expect(config.criteria).toBe(DEFAULT_CONFIG.criteria);
	});

	it("pads the players list up to 18 names", () => {
		const config = parseConfig({ players: ["Faker", "Caps"] });
		expect(config.players).toHaveLength(18);
		expect(config.players.slice(0, 3)).toEqual(["Faker", "Caps", "Joueur 3"]);
	});
});

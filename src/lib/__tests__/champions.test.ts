import { CHAMPION_IMAGES } from "@/lib/championImages";
import { CHAMPIONS } from "@/lib/champions";
import { formatDrawAsText } from "@/lib/shareText";

describe("CHAMPIONS", () => {
	it("has a unique Riot id for every champion", () => {
		expect(new Set(CHAMPIONS.map((c) => c.id)).size).toBe(CHAMPIONS.length);
	});

	it("has a bundled portrait for every champion", () => {
		// Chaque entrée est un require() : un portrait absent fait déjà échouer le chargement du module.
		const missing = CHAMPIONS.filter((c) => !CHAMPION_IMAGES[c.slug]);
		expect(missing.map((c) => c.slug)).toEqual([]);
	});
});

describe("formatDrawAsText", () => {
	it("lists every team with its players and champions", () => {
		const [ahri, zed] = CHAMPIONS;
		const text = formatDrawAsText([
			[
				{ name: "Faker", champion: ahri },
				{ name: "Caps", champion: zed },
			],
		]);
		expect(text).toBe(
			`⚔️ Tirage LoL Random Arena\nÉquipe Carapateur : Faker (${ahri.name}) + Caps (${zed.name})`,
		);
	});
});

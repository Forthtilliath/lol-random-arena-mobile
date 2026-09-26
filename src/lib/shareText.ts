import { TEAM_NAMES } from "@/constants/game";
import type { DrawnPlayer } from "@/lib/draw";

/** Résumé texte d'un tirage, prêt à coller dans le chat du lobby ou sur Discord. */
export function formatDrawAsText(teams: DrawnPlayer[][]): string {
	const lines = teams.map((team, i) => {
		const players = team.map((p) => `${p.name} (${p.champion.name})`).join(" + ");
		return `${TEAM_NAMES[i]} : ${players}`;
	});
	return ["⚔️ Tirage LoL Random Arena", ...lines].join("\n");
}

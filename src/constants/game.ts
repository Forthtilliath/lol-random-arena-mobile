import { CHAMPIONS } from "@/lib/champions";

export const TEAM_SETUP_KEYS = ["duo", "trio"] as const;
export type TeamSetupKey = (typeof TEAM_SETUP_KEYS)[number];

export type TeamSetup = {
	label: string;
	hint: string;
	groupLabel: string;
	teamSize: number;
	teamCount: number;
	playerCount: number;
};

/** Les deux formats du mode Arena. Mêmes valeurs que le site SvelteKit. */
export const TEAM_SETUPS: Record<TeamSetupKey, TeamSetup> = {
	duo: {
		label: "Duos",
		hint: "8 équipes de 2",
		groupLabel: "Duo",
		teamSize: 2,
		teamCount: 8,
		playerCount: 16,
	},
	trio: {
		label: "Trios",
		hint: "6 équipes de 3",
		groupLabel: "Trio",
		teamSize: 3,
		teamCount: 6,
		playerCount: 18,
	},
};

export const MAX_PLAYERS = 18;

/**
 * Doit rester >= au plus grand `playerCount` (18, en trios) : il reste ainsi toujours assez de
 * champions pour en donner un différent à chaque joueur.
 */
export const MIN_NON_BANNED_CHAMPIONS = 18;
export const MAX_AUTO_BANS = CHAMPIONS.length - MIN_NON_BANNED_CHAMPIONS;

export const TEAM_NAMES = [
	"Équipe Carapateur",
	"Équipe Poro",
	"Équipe Raptor",
	"Équipe Loup",
	"Équipe Krug",
	"Équipe Sbire",
	"Équipe Gromp",
	"Équipe Sentinelle",
];

export const CRITERIAS = ["popularity", "winrate", "mixed"] as const;
export type Criteria = (typeof CRITERIAS)[number];

export const CRITERIA_LABELS: Record<Criteria, { label: string; hint: string }> = {
	popularity: { label: "Popularité", hint: "Les plus joués" },
	winrate: { label: "Victoires", hint: "Meilleur taux" },
	mixed: { label: "Mixte", hint: "Les deux" },
};

export function defaultPlayerName(index: number): string {
	return `Joueur ${index + 1}`;
}

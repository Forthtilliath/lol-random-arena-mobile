import { type Criteria, defaultPlayerName, TEAM_SETUPS, type TeamSetupKey } from "@/constants/game";
import type { Champion } from "@/lib/champions";

export type DrawConfig = {
	setup: TeamSetupKey;
	/** Sinon, le joueur 1 fait équipe avec le 2, le 3 avec le 4, etc. */
	randomTeams: boolean;
	/** Toujours 18 pseudos : seuls les premiers servent, selon le format. */
	players: string[];
	autoBan: boolean;
	autoBanCount: number;
	criteria: Criteria;
};

export type DrawnPlayer = { name: string; champion: Champion };
export type Draw = {
	teams: DrawnPlayer[][];
	/** Nombre de champions réellement retirés du tirage (0 sans bannissement). */
	bannedCount: number;
	createdAt: number;
};

/** Générateur aléatoire injectable, pour des tests déterministes. Renvoie un nombre dans [0, 1[. */
export type Random = () => number;

export function shuffle<T>(items: readonly T[], random: Random = Math.random): T[] {
	const result = [...items];
	for (let i = result.length - 1; i > 0; i--) {
		const j = Math.floor(random() * (i + 1));
		[result[i], result[j]] = [result[j], result[i]];
	}
	return result;
}

export function chunk<T>(items: readonly T[], size: number): T[][] {
	const result: T[][] = [];
	for (let i = 0; i < items.length; i += size) result.push(items.slice(i, i + size));
	return result;
}

/** Pseudos utilisés par le format choisi ; un pseudo vide retombe sur « Joueur N ». */
export function getPlayerNames(config: DrawConfig): string[] {
	const { playerCount } = TEAM_SETUPS[config.setup];
	return Array.from(
		{ length: playerCount },
		(_, i) => config.players[i]?.trim() || defaultPlayerName(i),
	);
}

/**
 * Forme les équipes et donne un champion à chaque joueur. Comme dans un vrai lobby Arena, un
 * champion n'est jamais tiré deux fois. `pool` doit contenir au moins autant de champions que de
 * joueurs.
 */
export function drawTeams(
	config: DrawConfig,
	pool: readonly Champion[],
	random: Random = Math.random,
): DrawnPlayer[][] {
	const setup = TEAM_SETUPS[config.setup];
	const names = getPlayerNames(config);
	const ordered = config.randomTeams ? shuffle(names, random) : names;
	const champions = shuffle(pool, random);

	if (champions.length < ordered.length) {
		throw new Error(`Pas assez de champions (${champions.length}) pour ${ordered.length} joueurs`);
	}

	return chunk(
		ordered.map((name, i) => ({ name, champion: champions[i] })),
		setup.teamSize,
	);
}

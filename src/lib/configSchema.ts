import { z } from "zod";
import {
	CRITERIAS,
	defaultPlayerName,
	MAX_AUTO_BANS,
	MAX_PLAYERS,
	TEAM_SETUP_KEYS,
} from "@/constants/game";
import type { DrawConfig } from "@/lib/draw";

export const DEFAULT_CONFIG: DrawConfig = {
	setup: "duo",
	randomTeams: true,
	players: Array.from({ length: MAX_PLAYERS }, (_, i) => defaultPlayerName(i)),
	autoBan: false,
	autoBanCount: 8,
	criteria: "popularity",
};

/**
 * Valide une configuration venue du stockage (sauvegarde, ancienne version de l'app) : chaque
 * champ absent ou invalide retombe sur sa valeur par défaut au lieu de rejeter toute la config.
 */
export const configSchema = z.object({
	setup: z.enum(TEAM_SETUP_KEYS).catch(DEFAULT_CONFIG.setup),
	randomTeams: z.boolean().catch(DEFAULT_CONFIG.randomTeams),
	players: z
		.array(z.string())
		.catch(DEFAULT_CONFIG.players)
		.transform((players) => DEFAULT_CONFIG.players.map((fallback, i) => players[i] ?? fallback)),
	autoBan: z.boolean().catch(DEFAULT_CONFIG.autoBan),
	autoBanCount: z.number().int().min(1).max(MAX_AUTO_BANS).catch(DEFAULT_CONFIG.autoBanCount),
	criteria: z.enum(CRITERIAS).catch(DEFAULT_CONFIG.criteria),
});

export function parseConfig(value: unknown): DrawConfig {
	const result = configSchema.safeParse(value ?? {});
	return result.success ? result.data : DEFAULT_CONFIG;
}

import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { DEFAULT_CONFIG, parseConfig } from "@/lib/configSchema";
import type { DrawConfig } from "@/lib/draw";

type Actions = {
	update: (patch: Partial<DrawConfig>) => void;
	setPlayer: (index: number, name: string) => void;
	/** Remplace toute la configuration (chargement d'une sauvegarde). */
	replace: (config: DrawConfig) => void;
	resetPlayers: () => void;
};

// À incrémenter à tout changement cassant de la forme de DrawConfig.
export const CONFIG_STORE_VERSION = 1;

/**
 * Configuration courante du tirage. Persistée automatiquement : on retrouve ses pseudos à la
 * réouverture de l'app, sans passer par une sauvegarde nommée.
 */
export const useConfigStore = create<DrawConfig & Actions>()(
	persist(
		(set) => ({
			...DEFAULT_CONFIG,
			update: (patch) => set(patch),
			setPlayer: (index, name) =>
				set((state) => ({ players: state.players.map((p, i) => (i === index ? name : p)) })),
			replace: (config) => set(config),
			resetPlayers: () => set({ players: DEFAULT_CONFIG.players }),
		}),
		{
			name: "config-store",
			storage: createJSONStorage(() => AsyncStorage),
			version: CONFIG_STORE_VERSION,
			// Revalide ce qui vient du disque : une donnée corrompue ne doit pas casser l'écran.
			merge: (persisted, current) => ({ ...current, ...parseConfig(persisted) }),
		},
	),
);

/** Extrait la configuration seule, sans les actions du store. */
export function selectConfig(state: DrawConfig): DrawConfig {
	const { setup, randomTeams, players, autoBan, autoBanCount, criteria } = state;
	return { setup, randomTeams, players, autoBan, autoBanCount, criteria };
}

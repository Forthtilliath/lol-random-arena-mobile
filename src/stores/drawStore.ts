import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { fetchArenaStats, removeBanned } from "@/lib/arenaStats";
import { CHAMPIONS } from "@/lib/champions";
import { type Draw, type DrawConfig, drawTeams } from "@/lib/draw";

type State = {
	draw: Draw | null;
	loading: boolean;
	error: string | null;
};

type Actions = {
	/** Lance un tirage. Renvoie `true` s'il a abouti. */
	run: (config: DrawConfig) => Promise<boolean>;
	clearError: () => void;
};

export const DRAW_STORE_VERSION = 1;

/** Dernier tirage (persisté pour le retrouver après la fermeture de l'app) et état du calcul. */
export const useDrawStore = create<State & Actions>()(
	persist(
		(set) => ({
			draw: null,
			loading: false,
			error: null,
			run: async (config) => {
				set({ loading: true, error: null });
				try {
					let pool = [...CHAMPIONS];
					if (config.autoBan) {
						const stats = await fetchArenaStats();
						pool = removeBanned(CHAMPIONS, stats, config.criteria, config.autoBanCount);
					}
					const teams = drawTeams(config, pool);
					set({
						draw: { teams, bannedCount: CHAMPIONS.length - pool.length, createdAt: Date.now() },
						loading: false,
					});
					return true;
				} catch (error) {
					console.warn("Tirage impossible", error);
					set({
						loading: false,
						error: config.autoBan
							? "Impossible de récupérer les statistiques op.gg. Vérifie ta connexion, ou lance le tirage sans bannissement."
							: "Le tirage a échoué. Réessaie.",
					});
					return false;
				}
			},
			clearError: () => set({ error: null }),
		}),
		{
			name: "draw-store",
			storage: createJSONStorage(() => AsyncStorage),
			version: DRAW_STORE_VERSION,
			partialize: (state) => ({ draw: state.draw }),
		},
	),
);

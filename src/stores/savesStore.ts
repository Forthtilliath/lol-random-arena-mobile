import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { parseConfig } from "@/lib/configSchema";
import type { DrawConfig } from "@/lib/draw";

type State = {
	saves: Record<string, DrawConfig>;
};

type Actions = {
	save: (name: string, config: DrawConfig) => void;
	remove: (name: string) => void;
	/** Renvoie la sauvegarde revalidée (les champs manquants reprennent leur valeur par défaut). */
	get: (name: string) => DrawConfig | null;
};

export const SAVES_STORE_VERSION = 1;

/** Configurations nommées (« Soirée du vendredi »…), pour changer de groupe en un geste. */
export const useSavesStore = create<State & Actions>()(
	persist(
		(set, get) => ({
			saves: {},
			save: (name, config) => set((state) => ({ saves: { ...state.saves, [name]: config } })),
			remove: (name) =>
				set((state) => {
					const { [name]: _removed, ...rest } = state.saves;
					return { saves: rest };
				}),
			get: (name) => {
				const save = get().saves[name];
				return save ? parseConfig(save) : null;
			},
		}),
		{
			name: "saves-store",
			storage: createJSONStorage(() => AsyncStorage),
			version: SAVES_STORE_VERSION,
		},
	),
);

/**
 * Thème « Hextech » : palette officielle du client League of Legends. Thème sombre unique,
 * partagé à l'identique avec le site SvelteKit (lol-random-arena, src/app.css) : toute
 * modification se reporte des deux côtés.
 */
export const HEXTECH = {
	gold1: "#F0E6D2",
	gold2: "#C8AA6E",
	gold3: "#C89B3C",
	gold4: "#785A28",
	gold5: "#463714",
	gold6: "#32281E",

	blue1: "#CDFAFA",
	blue2: "#0AC8B9",
	blue3: "#0397AB",
	blue4: "#005A82",
	blue5: "#0A323C",
	blue6: "#091428",
	blue7: "#0A1428",

	grey1: "#A09B8C",
	grey2: "#5B5A56",
	grey3: "#3C3C41",
	grey4: "#1E2328",
	black: "#010A13",

	danger: "#E84057",
} as const;

/** Rôles sémantiques, pour ne pas manipuler les teintes brutes dans les composants. */
export const COLORS = {
	background: HEXTECH.black,
	surface: HEXTECH.blue7,
	surfaceDeep: HEXTECH.blue6,
	field: HEXTECH.grey4,
	border: HEXTECH.gold5,
	borderStrong: HEXTECH.gold4,
	borderMuted: HEXTECH.grey3,
	text: HEXTECH.gold1,
	textMuted: HEXTECH.grey1,
	textFaint: HEXTECH.grey2,
	primary: HEXTECH.gold2,
	primaryStrong: HEXTECH.gold3,
	accent: HEXTECH.blue2,
	accentStrong: HEXTECH.blue3,
	danger: HEXTECH.danger,
} as const;

export const FONTS = {
	display: "Cinzel_700Bold",
	displayMedium: "Cinzel_600SemiBold",
	body: "Inter_400Regular",
	bodyMedium: "Inter_500Medium",
	bodyBold: "Inter_600SemiBold",
} as const;

export const SPACING = {
	xs: 4,
	sm: 8,
	md: 16,
	lg: 24,
	xl: 32,
} as const;

/** Taille des coins biseautés des panneaux, la signature visuelle de l'interface. */
export const BEVEL = 12;

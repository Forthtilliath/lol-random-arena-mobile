import { ErrorFallback } from "@forthtilliath/react-native-kit/components/feedback/ErrorFallback";
import type { ErrorBoundaryProps } from "expo-router";
import { COLORS, FONTS, HEXTECH, SPACING } from "@/constants/theme";

/**
 * Écran de récupération d'une erreur de rendu imprévue, à réexporter comme `ErrorBoundary` d'une
 * route (convention Expo Router). Sur un écran à en-tête, la flèche retour reste utilisable. Les
 * données persistées (pseudos, sauvegardes, dernier tirage) ne sont pas touchées.
 */
export function ErrorBoundary(props: ErrorBoundaryProps) {
	return <ErrorFallback {...props} labels={LABELS} showDetails={false} styles={STYLES} />;
}

const LABELS = {
	hint: "L'application a rencontré un problème inattendu. Tes pseudos et tes groupes restent enregistrés sur l'appareil.",
};

// fontWeight à "normal" : sur Android, un poids explicite fait ignorer la police chargée.
const STYLES = {
	container: {
		backgroundColor: COLORS.background,
		padding: SPACING.lg,
	},
	emoji: {
		display: "none",
	},
	title: {
		fontFamily: FONTS.display,
		fontWeight: "normal",
		color: COLORS.text,
	},
	hint: {
		fontFamily: FONTS.body,
		opacity: 1,
		color: COLORS.textMuted,
	},
	button: {
		borderRadius: 0,
		borderWidth: 2,
		borderColor: HEXTECH.gold3,
		backgroundColor: HEXTECH.blue7,
	},
	buttonText: {
		fontFamily: FONTS.display,
		fontWeight: "normal",
		letterSpacing: 1.8,
		textTransform: "uppercase",
		color: COLORS.text,
	},
} as const;

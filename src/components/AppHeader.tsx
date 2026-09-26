import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONTS, HEXTECH, SPACING } from "@/constants/theme";

/** Titre de l'accueil, façon écran de lancement du client LoL. */
export function AppHeader() {
	return (
		<View style={styles.container}>
			<Text style={styles.kicker}>League of Legends · Arena</Text>
			<Text style={styles.title} accessibilityRole="header">
				Random Arena
			</Text>
			<View style={styles.divider} accessibilityElementsHidden importantForAccessibility="no">
				<View style={styles.line} />
				<View style={styles.diamond} />
				<View style={styles.line} />
			</View>
			<Text style={styles.subtitle}>
				Inscris les joueurs du lobby : chacun reçoit une équipe et un champion, sans doublon.
			</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		paddingTop: SPACING.lg,
		paddingBottom: SPACING.lg,
		gap: SPACING.sm,
	},
	kicker: {
		fontFamily: FONTS.bodyBold,
		fontSize: 11,
		letterSpacing: 3.5,
		textTransform: "uppercase",
		color: HEXTECH.blue2,
	},
	title: {
		fontFamily: FONTS.display,
		fontSize: 38,
		letterSpacing: 1.5,
		textTransform: "uppercase",
		color: HEXTECH.gold2,
		textShadowColor: "rgba(200, 155, 60, 0.35)",
		textShadowRadius: 12,
	},
	divider: {
		flexDirection: "row",
		alignItems: "center",
		gap: SPACING.sm,
		width: 200,
	},
	line: {
		flex: 1,
		height: 1,
		backgroundColor: HEXTECH.gold4,
	},
	diamond: {
		width: 7,
		height: 7,
		borderWidth: 1,
		borderColor: HEXTECH.gold2,
		transform: [{ rotate: "45deg" }],
	},
	subtitle: {
		fontFamily: FONTS.body,
		fontSize: 14,
		lineHeight: 20,
		textAlign: "center",
		color: COLORS.textMuted,
		paddingHorizontal: SPACING.md,
	},
});

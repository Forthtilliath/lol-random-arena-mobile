import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONTS, HEXTECH, SPACING } from "@/constants/theme";

type Props = {
	/** Numéro d'étape affiché dans le losange doré. */
	step: number;
	title: string;
	description?: string;
	/** Actions alignées à droite du titre. */
	actions?: ReactNode;
};

export function SectionHeader({ step, title, description, actions }: Props) {
	return (
		<View style={styles.row}>
			<View style={styles.diamond} accessibilityElementsHidden importantForAccessibility="no">
				<Text style={styles.step}>{step}</Text>
			</View>
			<View style={styles.texts}>
				<Text style={styles.title} accessibilityRole="header">
					{title}
				</Text>
				{description && <Text style={styles.description}>{description}</Text>}
			</View>
			{actions}
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: SPACING.sm + 4,
		marginBottom: SPACING.md,
	},
	diamond: {
		width: 26,
		height: 26,
		marginHorizontal: 4,
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: HEXTECH.gold3,
		backgroundColor: COLORS.background,
		transform: [{ rotate: "45deg" }],
	},
	step: {
		fontFamily: FONTS.display,
		fontSize: 13,
		color: COLORS.primary,
		transform: [{ rotate: "-45deg" }],
	},
	texts: {
		flex: 1,
	},
	title: {
		fontFamily: FONTS.display,
		fontSize: 17,
		letterSpacing: 1.5,
		textTransform: "uppercase",
		color: COLORS.text,
	},
	description: {
		fontFamily: FONTS.body,
		fontSize: 13,
		color: COLORS.textMuted,
	},
});

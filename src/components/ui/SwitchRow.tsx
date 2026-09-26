import { Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { COLORS, FONTS, HEXTECH, SPACING } from "@/constants/theme";
import { selectFeedback } from "@/lib/haptics";

type Props = {
	label: string;
	description: string;
	value: boolean;
	onChange: (value: boolean) => void;
};

/** Ligne « libellé + description + interrupteur » : toute la ligne est pressable. */
export function SwitchRow({ label, description, value, onChange }: Props) {
	const toggle = (next: boolean) => {
		selectFeedback();
		onChange(next);
	};

	return (
		<Pressable
			onPress={() => toggle(!value)}
			style={styles.row}
			accessibilityRole="switch"
			accessibilityState={{ checked: value }}
			accessibilityLabel={label}
			accessibilityHint={description}
		>
			<View style={styles.texts}>
				<Text style={styles.label}>{label}</Text>
				<Text style={styles.description}>{description}</Text>
			</View>
			<Switch
				value={value}
				onValueChange={toggle}
				trackColor={{ false: HEXTECH.grey3, true: HEXTECH.blue3 }}
				thumbColor={value ? HEXTECH.blue1 : HEXTECH.grey1}
				importantForAccessibility="no-hide-descendants"
			/>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: SPACING.md,
		paddingVertical: SPACING.sm + 4,
		paddingHorizontal: SPACING.md,
		borderWidth: 1,
		borderColor: "rgba(60, 60, 65, 0.7)",
		backgroundColor: "rgba(1, 10, 19, 0.5)",
	},
	texts: {
		flex: 1,
		gap: 2,
	},
	label: {
		fontFamily: FONTS.bodyBold,
		fontSize: 14,
		color: COLORS.text,
	},
	description: {
		fontFamily: FONTS.body,
		fontSize: 12,
		color: COLORS.textMuted,
	},
});

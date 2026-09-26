import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, FONTS, HEXTECH, SPACING } from "@/constants/theme";
import { selectFeedback } from "@/lib/haptics";

type Option<T extends string> = { value: T; label: string; hint?: string };

type Props<T extends string> = {
	options: Option<T>[];
	value: T;
	onChange: (value: T) => void;
	/** Décrit le choix pour le lecteur d'écran. */
	label: string;
};

/** Onglets exclusifs (format Duos/Trios, critère de bannissement), équivalent du site. */
export function SegmentedControl<T extends string>({ options, value, onChange, label }: Props<T>) {
	return (
		<View style={styles.row} accessibilityRole="radiogroup" accessibilityLabel={label}>
			{options.map((option) => {
				const selected = option.value === value;
				return (
					<Pressable
						key={option.value}
						onPress={() => {
							if (!selected) selectFeedback();
							onChange(option.value);
						}}
						accessibilityRole="radio"
						accessibilityState={{ selected }}
						accessibilityLabel={option.hint ? `${option.label}, ${option.hint}` : option.label}
						style={[styles.option, selected && styles.selected]}
					>
						<Text style={[styles.label, selected && styles.labelSelected]}>{option.label}</Text>
						{option.hint && (
							<Text style={[styles.hint, selected && styles.hintSelected]}>{option.hint}</Text>
						)}
					</Pressable>
				);
			})}
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		gap: SPACING.sm,
	},
	option: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		gap: 2,
		paddingVertical: 10,
		paddingHorizontal: SPACING.xs,
		borderWidth: 1,
		borderColor: COLORS.borderMuted,
		backgroundColor: "rgba(1, 10, 19, 0.6)",
	},
	selected: {
		borderColor: HEXTECH.gold2,
		backgroundColor: "rgba(70, 55, 20, 0.45)",
	},
	label: {
		fontFamily: FONTS.displayMedium,
		fontSize: 13,
		letterSpacing: 1.2,
		textTransform: "uppercase",
		color: COLORS.textMuted,
	},
	labelSelected: {
		color: COLORS.text,
	},
	hint: {
		fontFamily: FONTS.body,
		fontSize: 11,
		color: COLORS.textFaint,
	},
	hintSelected: {
		color: COLORS.textMuted,
	},
});

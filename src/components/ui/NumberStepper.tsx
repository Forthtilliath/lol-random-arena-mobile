import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { COLORS, FONTS, HEXTECH } from "@/constants/theme";
import { tapFeedback } from "@/lib/haptics";

type Props = {
	value: number;
	onChange: (value: number) => void;
	min: number;
	max: number;
	/** Ce que compte le compteur, repris par le lecteur d'écran (« Diminuer bannissements »). */
	label: string;
};

/** Compteur −/+ borné. Un appui long saute de 5 en 5 pour atteindre vite les grandes valeurs. */
export function NumberStepper({ value, onChange, min, max, label }: Props) {
	const step = (delta: number) => {
		const next = Math.min(max, Math.max(min, value + delta));
		if (next !== value) {
			tapFeedback();
			onChange(next);
		}
	};

	return (
		<View style={styles.row} accessibilityRole="adjustable" accessibilityLabel={label}>
			<StepButton
				icon="remove"
				label={`Diminuer ${label}`}
				disabled={value <= min}
				onPress={() => step(-1)}
				onLongPress={() => step(-5)}
			/>
			<Text style={styles.value}>{value}</Text>
			<StepButton
				icon="add"
				label={`Augmenter ${label}`}
				disabled={value >= max}
				onPress={() => step(1)}
				onLongPress={() => step(5)}
			/>
		</View>
	);
}

type StepButtonProps = {
	icon: "add" | "remove";
	label: string;
	disabled: boolean;
	onPress: () => void;
	onLongPress: () => void;
};

function StepButton({ icon, label, disabled, onPress, onLongPress }: StepButtonProps) {
	return (
		<Pressable
			onPress={onPress}
			onLongPress={onLongPress}
			disabled={disabled}
			accessibilityRole="button"
			accessibilityLabel={label}
			style={({ pressed }) => [
				styles.button,
				pressed && styles.pressed,
				disabled && styles.disabled,
			]}
		>
			<Ionicons name={icon} size={18} color={COLORS.primary} />
		</Pressable>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		alignItems: "stretch",
		borderWidth: 1,
		borderColor: HEXTECH.gold4,
	},
	button: {
		width: 42,
		height: 42,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: HEXTECH.grey4,
	},
	pressed: {
		backgroundColor: "rgba(70, 55, 20, 0.6)",
	},
	disabled: {
		opacity: 0.4,
	},
	value: {
		minWidth: 52,
		textAlign: "center",
		textAlignVertical: "center",
		lineHeight: 42,
		fontFamily: FONTS.bodyBold,
		fontSize: 16,
		color: COLORS.text,
		backgroundColor: COLORS.background,
		borderLeftWidth: 1,
		borderRightWidth: 1,
		borderColor: HEXTECH.gold4,
	},
});

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import type { ComponentProps } from "react";
import {
	ActivityIndicator,
	Pressable,
	type StyleProp,
	StyleSheet,
	Text,
	View,
	type ViewStyle,
} from "react-native";
import { COLORS, FONTS, HEXTECH, SPACING } from "@/constants/theme";
import { tapFeedback } from "@/lib/haptics";

type Props = {
	label: string;
	onPress: () => void;
	icon?: ComponentProps<typeof Ionicons>["name"];
	/** `primary` : bouton « Jouer » du client LoL. `outline` : action secondaire. */
	variant?: "primary" | "outline";
	size?: "md" | "lg";
	loading?: boolean;
	disabled?: boolean;
	style?: StyleProp<ViewStyle>;
};

export function HextechButton({
	label,
	onPress,
	icon,
	variant = "primary",
	size = "md",
	loading,
	disabled,
	style,
}: Props) {
	const inactive = disabled || loading;
	const primary = variant === "primary";
	const color = primary ? COLORS.text : COLORS.primary;

	return (
		<Pressable
			onPress={() => {
				tapFeedback();
				onPress();
			}}
			disabled={inactive}
			accessibilityRole="button"
			accessibilityLabel={label}
			accessibilityState={{ disabled: !!inactive, busy: !!loading }}
			style={({ pressed }) => [
				styles.base,
				primary ? styles.primary : styles.outline,
				size === "lg" && styles.large,
				pressed && styles.pressed,
				inactive && styles.inactive,
				style,
			]}
		>
			{primary && (
				<LinearGradient
					colors={[HEXTECH.grey4, HEXTECH.blue7]}
					style={StyleSheet.absoluteFill}
					pointerEvents="none"
				/>
			)}
			<View style={styles.content}>
				{loading ? (
					<ActivityIndicator color={HEXTECH.blue2} />
				) : (
					icon && <Ionicons name={icon} size={size === "lg" ? 20 : 16} color={color} />
				)}
				<Text
					style={[
						primary ? styles.primaryLabel : styles.outlineLabel,
						size === "lg" && styles.largeLabel,
						{ color },
					]}
				>
					{label}
				</Text>
			</View>
		</Pressable>
	);
}

const styles = StyleSheet.create({
	base: {
		minHeight: 44,
		paddingHorizontal: SPACING.md,
		justifyContent: "center",
		overflow: "hidden",
	},
	primary: {
		borderWidth: 2,
		borderColor: HEXTECH.gold3,
	},
	outline: {
		borderWidth: 1,
		borderColor: HEXTECH.gold4,
		backgroundColor: "rgba(1, 10, 19, 0.6)",
	},
	large: {
		minHeight: 56,
	},
	pressed: {
		borderColor: HEXTECH.gold1,
		opacity: 0.85,
	},
	inactive: {
		opacity: 0.5,
	},
	content: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: SPACING.sm,
	},
	primaryLabel: {
		fontFamily: FONTS.display,
		fontSize: 14,
		letterSpacing: 1.8,
		textTransform: "uppercase",
	},
	outlineLabel: {
		fontFamily: FONTS.bodyBold,
		fontSize: 14,
	},
	largeLabel: {
		fontSize: 17,
	},
});

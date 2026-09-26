import { LinearGradient } from "expo-linear-gradient";
import type { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";
import { COLORS } from "@/constants/theme";

/** Fond noir hextech avec le halo bleuté du haut d'écran, comme sur le site. */
export function ScreenBackground({ children }: PropsWithChildren) {
	return (
		<View style={styles.root}>
			<LinearGradient
				colors={["rgba(3, 151, 171, 0.28)", "rgba(3, 151, 171, 0)"]}
				style={styles.glow}
				pointerEvents="none"
			/>
			{children}
		</View>
	);
}

const styles = StyleSheet.create({
	root: {
		flex: 1,
		backgroundColor: COLORS.background,
	},
	glow: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		height: 320,
	},
});

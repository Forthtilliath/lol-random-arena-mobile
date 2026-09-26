import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { AppHeader } from "@/components/AppHeader";
import { BansSection } from "@/components/config/BansSection";
import { PlayersSection } from "@/components/config/PlayersSection";
import { HextechButton } from "@/components/ui/HextechButton";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { COLORS, FONTS, HEXTECH, SPACING } from "@/constants/theme";
import { errorFeedback, successFeedback } from "@/lib/haptics";
import { selectConfig, useConfigStore } from "@/stores/configStore";
import { useDrawStore } from "@/stores/drawStore";

const CTA_HEIGHT = 56;

export default function ConfigScreen() {
	const insets = useSafeAreaInsets();
	const loading = useDrawStore((s) => s.loading);
	const error = useDrawStore((s) => s.error);
	const hasDraw = useDrawStore((s) => s.draw !== null);
	const run = useDrawStore((s) => s.run);
	const clearError = useDrawStore((s) => s.clearError);

	const launch = async () => {
		const ok = await run(selectConfig(useConfigStore.getState()));
		if (ok) {
			successFeedback();
			router.push("/results");
		} else {
			errorFeedback();
		}
	};

	return (
		<ScreenBackground>
			<SafeAreaView style={styles.flex} edges={["top", "left", "right"]}>
				<ScrollView
					contentContainerStyle={[
						styles.content,
						{ paddingBottom: CTA_HEIGHT + insets.bottom + SPACING.xl },
					]}
					keyboardShouldPersistTaps="handled"
					automaticallyAdjustKeyboardInsets
				>
					<AppHeader />

					{hasDraw && (
						<Pressable
							onPress={() => router.push("/results")}
							style={styles.lastDraw}
							accessibilityRole="button"
						>
							<Ionicons name="trophy-outline" size={16} color={HEXTECH.blue2} />
							<Text style={styles.lastDrawText}>Voir le dernier tirage</Text>
							<Ionicons name="chevron-forward" size={16} color={HEXTECH.blue2} />
						</Pressable>
					)}

					<PlayersSection />
					<BansSection />
				</ScrollView>
			</SafeAreaView>

			{/* Bouton collé en bas d'écran : lancer le tirage sans avoir à remonter. */}
			<LinearGradient
				colors={["rgba(1, 10, 19, 0)", "rgba(1, 10, 19, 0.95)", COLORS.background]}
				locations={[0, 0.35, 1]}
				style={[styles.footer, { paddingBottom: insets.bottom + SPACING.md }]}
			>
				{error && (
					<Pressable onPress={clearError} style={styles.error} accessibilityRole="alert">
						<Ionicons name="warning-outline" size={16} color={COLORS.danger} />
						<Text style={styles.errorText}>{error}</Text>
					</Pressable>
				)}
				<HextechButton
					label={loading ? "Tirage en cours…" : "Lancer le tirage"}
					icon="dice-outline"
					size="lg"
					loading={loading}
					onPress={launch}
				/>
			</LinearGradient>
		</ScreenBackground>
	);
}

const styles = StyleSheet.create({
	flex: {
		flex: 1,
	},
	content: {
		paddingHorizontal: SPACING.md,
		gap: SPACING.md,
	},
	lastDraw: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		gap: SPACING.sm,
		paddingVertical: SPACING.sm,
		borderWidth: 1,
		borderColor: "rgba(10, 200, 185, 0.35)",
		backgroundColor: "rgba(10, 50, 60, 0.35)",
	},
	lastDrawText: {
		fontFamily: FONTS.bodyBold,
		fontSize: 14,
		color: HEXTECH.blue1,
	},
	footer: {
		position: "absolute",
		left: 0,
		right: 0,
		bottom: 0,
		paddingTop: SPACING.xl,
		paddingHorizontal: SPACING.md,
		gap: SPACING.sm,
	},
	error: {
		flexDirection: "row",
		alignItems: "center",
		gap: SPACING.sm,
		padding: SPACING.sm,
		borderWidth: 1,
		borderColor: COLORS.danger,
		backgroundColor: "rgba(232, 64, 87, 0.12)",
	},
	errorText: {
		flex: 1,
		fontFamily: FONTS.body,
		fontSize: 13,
		color: COLORS.text,
	},
});

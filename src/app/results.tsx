import { router } from "expo-router";
import { ScrollView, Share, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TeamCard } from "@/components/results/TeamCard";
import { HextechButton } from "@/components/ui/HextechButton";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { TEAM_NAMES } from "@/constants/game";
import { COLORS, FONTS, HEXTECH, SPACING } from "@/constants/theme";
import { errorFeedback, successFeedback } from "@/lib/haptics";
import { formatDrawAsText } from "@/lib/shareText";
import { selectConfig, useConfigStore } from "@/stores/configStore";
import { useDrawStore } from "@/stores/drawStore";

export default function ResultsScreen() {
	const draw = useDrawStore((s) => s.draw);
	const loading = useDrawStore((s) => s.loading);
	const error = useDrawStore((s) => s.error);
	const run = useDrawStore((s) => s.run);

	if (!draw) {
		return (
			<ScreenBackground>
				<View style={styles.empty}>
					<Text style={styles.subtitle}>Aucun tirage pour l'instant.</Text>
					<HextechButton label="Configurer un tirage" onPress={() => router.back()} />
				</View>
			</ScreenBackground>
		);
	}

	const { teams, bannedCount } = draw;
	// Duos : deux équipes par ligne. Trios : une par ligne, sinon les portraits sont trop petits.
	const twoColumns = (teams[0]?.length ?? 2) === 2;

	const reroll = async () => {
		const ok = await run(selectConfig(useConfigStore.getState()));
		if (ok) successFeedback();
		else errorFeedback();
	};

	const share = () => {
		Share.share({ message: formatDrawAsText(teams) }).catch(() => {});
	};

	return (
		<ScreenBackground>
			<SafeAreaView style={styles.flex} edges={["left", "right", "bottom"]}>
				<ScrollView contentContainerStyle={styles.content}>
					<View>
						<Text style={styles.title} accessibilityRole="header">
							Résultat du tirage
						</Text>
						<Text style={styles.subtitle}>
							{teams.length} équipes · {teams.flat().length} champions, tous différents
							{bannedCount > 0 ? ` · ${bannedCount} bannis` : ""}
						</Text>
					</View>

					<View style={styles.grid}>
						{teams.map((team, i) => (
							<View
								key={team.map((p) => p.champion.id).join("-")}
								style={twoColumns ? styles.half : styles.full}
							>
								<TeamCard name={TEAM_NAMES[i]} team={team} />
							</View>
						))}
					</View>
				</ScrollView>

				<View style={styles.footer}>
					{error && <Text style={styles.error}>{error}</Text>}
					<View style={styles.actions}>
						<HextechButton
							label="Partager"
							icon="share-social-outline"
							variant="outline"
							onPress={share}
							style={styles.action}
						/>
						<HextechButton
							label="Relancer"
							icon="dice-outline"
							loading={loading}
							onPress={reroll}
							style={styles.action}
						/>
					</View>
				</View>
			</SafeAreaView>
		</ScreenBackground>
	);
}

const styles = StyleSheet.create({
	flex: {
		flex: 1,
	},
	content: {
		padding: SPACING.md,
		gap: SPACING.md,
	},
	title: {
		fontFamily: FONTS.display,
		fontSize: 24,
		letterSpacing: 1,
		textTransform: "uppercase",
		color: HEXTECH.gold2,
	},
	subtitle: {
		fontFamily: FONTS.body,
		fontSize: 13,
		color: COLORS.textMuted,
	},
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: SPACING.sm,
	},
	half: {
		width: "48.5%",
		flexGrow: 1,
	},
	full: {
		width: "100%",
	},
	empty: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		gap: SPACING.md,
		padding: SPACING.lg,
	},
	footer: {
		gap: SPACING.sm,
		paddingHorizontal: SPACING.md,
		paddingTop: SPACING.sm,
		paddingBottom: SPACING.md,
		borderTopWidth: 1,
		borderTopColor: HEXTECH.gold5,
		backgroundColor: COLORS.background,
	},
	error: {
		fontFamily: FONTS.body,
		fontSize: 13,
		color: COLORS.danger,
	},
	actions: {
		flexDirection: "row",
		gap: SPACING.sm,
	},
	action: {
		flex: 1,
	},
});

import { router } from "expo-router";
import { StyleSheet, Text, TextInput, View } from "react-native";
import { HexPanel } from "@/components/ui/HexPanel";
import { HextechButton } from "@/components/ui/HextechButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { SwitchRow } from "@/components/ui/SwitchRow";
import { defaultPlayerName, TEAM_SETUP_KEYS, TEAM_SETUPS } from "@/constants/game";
import { COLORS, FONTS, HEXTECH, SPACING } from "@/constants/theme";
import { chunk } from "@/lib/draw";
import { useConfigStore } from "@/stores/configStore";

const SETUP_OPTIONS = TEAM_SETUP_KEYS.map((key) => ({
	value: key,
	label: TEAM_SETUPS[key].label,
	hint: TEAM_SETUPS[key].hint,
}));

export function PlayersSection() {
	const setup = useConfigStore((s) => s.setup);
	const randomTeams = useConfigStore((s) => s.randomTeams);
	const players = useConfigStore((s) => s.players);
	const update = useConfigStore((s) => s.update);
	const setPlayer = useConfigStore((s) => s.setPlayer);

	const { playerCount, teamSize, groupLabel } = TEAM_SETUPS[setup];
	const groups = chunk(
		Array.from({ length: playerCount }, (_, i) => i),
		teamSize,
	);

	return (
		<HexPanel>
			<SectionHeader step={1} title="Joueurs" description="Le format et les pseudos du lobby." />

			<View style={styles.actions}>
				<HextechButton
					label="Mes groupes"
					icon="folder-open-outline"
					variant="outline"
					onPress={() => router.push("/saves")}
					style={styles.action}
				/>
			</View>

			<View style={styles.stack}>
				<SegmentedControl
					label="Format de la partie"
					options={SETUP_OPTIONS}
					value={setup}
					onChange={(value) => update({ setup: value })}
				/>
				<SwitchRow
					label="Équipes aléatoires"
					description="Désactivé : le joueur 1 fait équipe avec le 2, le 3 avec le 4, etc."
					value={randomTeams}
					onChange={(value) => update({ randomTeams: value })}
				/>

				<View style={styles.grid}>
					{groups.map((group, g) => (
						<View key={group[0]} style={styles.group}>
							<Text style={styles.groupLabel}>
								{groupLabel} {g + 1}
							</Text>
							{group.map((index) => (
								<TextInput
									key={index}
									value={players[index]}
									onChangeText={(name) => setPlayer(index, name)}
									placeholder={defaultPlayerName(index)}
									placeholderTextColor={COLORS.textFaint}
									accessibilityLabel={defaultPlayerName(index)}
									selectTextOnFocus
									autoCorrect={false}
									maxLength={24}
									style={styles.input}
								/>
							))}
						</View>
					))}
				</View>
			</View>
		</HexPanel>
	);
}

const styles = StyleSheet.create({
	actions: {
		flexDirection: "row",
		marginTop: -SPACING.sm,
		marginBottom: SPACING.md,
	},
	action: {
		flex: 1,
	},
	stack: {
		gap: SPACING.md,
	},
	grid: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: SPACING.sm,
	},
	group: {
		flexBasis: "48%",
		flexGrow: 1,
		gap: 6,
		padding: SPACING.sm,
		borderWidth: 1,
		borderColor: HEXTECH.gold5,
		backgroundColor: "rgba(9, 20, 40, 0.6)",
	},
	groupLabel: {
		fontFamily: FONTS.displayMedium,
		fontSize: 11,
		letterSpacing: 2,
		textTransform: "uppercase",
		color: HEXTECH.gold3,
	},
	input: {
		height: 38,
		paddingHorizontal: SPACING.sm,
		borderWidth: 1,
		borderColor: COLORS.borderMuted,
		backgroundColor: "rgba(1, 10, 19, 0.7)",
		color: COLORS.text,
		fontFamily: FONTS.body,
		fontSize: 14,
	},
});

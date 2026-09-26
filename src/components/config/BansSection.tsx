import { StyleSheet, Text, View } from "react-native";
import { HexPanel } from "@/components/ui/HexPanel";
import { NumberStepper } from "@/components/ui/NumberStepper";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { SwitchRow } from "@/components/ui/SwitchRow";
import { CRITERIA_LABELS, CRITERIAS, MAX_AUTO_BANS } from "@/constants/game";
import { COLORS, FONTS, SPACING } from "@/constants/theme";
import { useConfigStore } from "@/stores/configStore";

const CRITERIA_OPTIONS = CRITERIAS.map((value) => ({ value, ...CRITERIA_LABELS[value] }));

export function BansSection() {
	const autoBan = useConfigStore((s) => s.autoBan);
	const autoBanCount = useConfigStore((s) => s.autoBanCount);
	const criteria = useConfigStore((s) => s.criteria);
	const update = useConfigStore((s) => s.update);

	return (
		<HexPanel>
			<SectionHeader
				step={2}
				title="Bannissements"
				description="Retire les champions les plus forts du moment."
			/>

			<View style={styles.stack}>
				<SwitchRow
					label="Bannissement automatique"
					description="D'après les statistiques Arena actuelles d'op.gg (connexion requise)."
					value={autoBan}
					onChange={(value) => update({ autoBan: value })}
				/>

				{autoBan && (
					<>
						<View style={styles.countRow}>
							<View style={styles.countTexts}>
								<Text style={styles.label}>Nombre de bannissements</Text>
								<Text style={styles.hint}>
									Les {autoBanCount} premiers du classement sont retirés.
								</Text>
							</View>
							<NumberStepper
								label="bannissements"
								value={autoBanCount}
								min={1}
								max={MAX_AUTO_BANS}
								onChange={(value) => update({ autoBanCount: value })}
							/>
						</View>

						<View style={styles.criteria}>
							<Text style={styles.label}>Critère de classement</Text>
							<SegmentedControl
								label="Critère de classement des bannissements"
								options={CRITERIA_OPTIONS}
								value={criteria}
								onChange={(value) => update({ criteria: value })}
							/>
						</View>
					</>
				)}
			</View>
		</HexPanel>
	);
}

const styles = StyleSheet.create({
	stack: {
		gap: SPACING.md,
	},
	countRow: {
		flexDirection: "row",
		alignItems: "center",
		gap: SPACING.md,
	},
	countTexts: {
		flex: 1,
		gap: 2,
	},
	criteria: {
		gap: SPACING.sm,
	},
	label: {
		fontFamily: FONTS.bodyBold,
		fontSize: 14,
		color: COLORS.text,
	},
	hint: {
		fontFamily: FONTS.body,
		fontSize: 12,
		color: COLORS.textMuted,
	},
});

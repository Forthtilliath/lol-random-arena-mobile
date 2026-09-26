import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HexPanel } from "@/components/ui/HexPanel";
import { HextechButton } from "@/components/ui/HextechButton";
import { ScreenBackground } from "@/components/ui/ScreenBackground";
import { TEAM_SETUPS } from "@/constants/game";
import { COLORS, FONTS, HEXTECH, SPACING } from "@/constants/theme";
import { successFeedback } from "@/lib/haptics";
import { selectConfig, useConfigStore } from "@/stores/configStore";
import { useSavesStore } from "@/stores/savesStore";

/** Groupes de joueurs sauvegardés : enregistrer la config courante, en recharger une, en supprimer. */
export default function SavesScreen() {
	const saves = useSavesStore((s) => s.saves);
	const save = useSavesStore((s) => s.save);
	const remove = useSavesStore((s) => s.remove);
	const getSave = useSavesStore((s) => s.get);
	const replace = useConfigStore((s) => s.replace);
	const [name, setName] = useState("");

	const trimmed = name.trim();
	const exists = trimmed in saves;
	const names = Object.keys(saves).sort((a, b) => a.localeCompare(b, "fr"));

	const saveCurrent = () => {
		if (!trimmed) return;
		save(trimmed, selectConfig(useConfigStore.getState()));
		successFeedback();
		setName("");
	};

	const load = (saveName: string) => {
		const config = getSave(saveName);
		if (!config) return;
		replace(config);
		successFeedback();
		router.back();
	};

	const confirmRemove = (saveName: string) => {
		Alert.alert("Supprimer ce groupe ?", `« ${saveName} » sera définitivement supprimé.`, [
			{ text: "Annuler", style: "cancel" },
			{ text: "Supprimer", style: "destructive", onPress: () => remove(saveName) },
		]);
	};

	return (
		<ScreenBackground>
			<SafeAreaView style={styles.flex} edges={["left", "right", "bottom"]}>
				<FlatList
					data={names}
					keyExtractor={(item) => item}
					contentContainerStyle={styles.content}
					keyboardShouldPersistTaps="handled"
					ListHeaderComponent={
						<HexPanel style={styles.form}>
							<Text style={styles.label}>Sauvegarder les pseudos et réglages actuels</Text>
							<TextInput
								value={name}
								onChangeText={setName}
								placeholder="Nom du groupe (ex. Soirée du vendredi)"
								placeholderTextColor={COLORS.textFaint}
								accessibilityLabel="Nom du groupe"
								returnKeyType="done"
								onSubmitEditing={saveCurrent}
								maxLength={40}
								style={styles.input}
							/>
							{exists && (
								<Text style={styles.warning}>Ce nom existe déjà : le groupe sera remplacé.</Text>
							)}
							<HextechButton
								label={exists ? "Remplacer" : "Sauvegarder"}
								icon="save-outline"
								disabled={!trimmed}
								onPress={saveCurrent}
							/>
						</HexPanel>
					}
					ListEmptyComponent={
						<Text style={styles.empty}>
							Aucun groupe pour l'instant. Sauvegarde tes pseudos pour les retrouver en un geste.
						</Text>
					}
					renderItem={({ item }) => {
						const setup = TEAM_SETUPS[saves[item].setup] ?? TEAM_SETUPS.duo;
						return (
							<View style={styles.row}>
								<Pressable
									onPress={() => load(item)}
									style={styles.rowMain}
									accessibilityRole="button"
									accessibilityLabel={`Charger ${item}`}
								>
									<Text style={styles.rowName} numberOfLines={1}>
										{item}
									</Text>
									<Text style={styles.rowHint}>
										{setup.label} · {saves[item].players.slice(0, 3).join(", ")}…
									</Text>
								</Pressable>
								<Pressable
									onPress={() => confirmRemove(item)}
									hitSlop={10}
									accessibilityRole="button"
									accessibilityLabel={`Supprimer ${item}`}
								>
									<Ionicons name="trash-outline" size={20} color={COLORS.textMuted} />
								</Pressable>
							</View>
						);
					}}
				/>
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
		gap: SPACING.sm,
	},
	form: {
		gap: SPACING.sm,
		marginBottom: SPACING.md,
	},
	label: {
		fontFamily: FONTS.bodyBold,
		fontSize: 14,
		color: COLORS.text,
	},
	input: {
		height: 44,
		paddingHorizontal: SPACING.sm + 4,
		borderWidth: 1,
		borderColor: COLORS.borderMuted,
		backgroundColor: COLORS.background,
		color: COLORS.text,
		fontFamily: FONTS.body,
		fontSize: 15,
	},
	warning: {
		fontFamily: FONTS.body,
		fontSize: 12,
		color: HEXTECH.gold3,
	},
	empty: {
		fontFamily: FONTS.body,
		fontSize: 14,
		textAlign: "center",
		color: COLORS.textMuted,
		padding: SPACING.lg,
	},
	row: {
		flexDirection: "row",
		alignItems: "center",
		gap: SPACING.md,
		paddingVertical: SPACING.sm + 4,
		paddingHorizontal: SPACING.md,
		borderWidth: 1,
		borderColor: HEXTECH.gold5,
		backgroundColor: COLORS.surface,
	},
	rowMain: {
		flex: 1,
		gap: 2,
	},
	rowName: {
		fontFamily: FONTS.displayMedium,
		fontSize: 15,
		color: COLORS.text,
	},
	rowHint: {
		fontFamily: FONTS.body,
		fontSize: 12,
		color: COLORS.textMuted,
	},
});

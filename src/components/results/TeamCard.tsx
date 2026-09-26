import { StyleSheet, Text, View } from "react-native";
import { HexPanel } from "@/components/ui/HexPanel";
import { FONTS, HEXTECH, SPACING } from "@/constants/theme";
import type { DrawnPlayer } from "@/lib/draw";
import { ChampionTile } from "./ChampionTile";

type Props = {
	name: string;
	team: DrawnPlayer[];
};

export function TeamCard({ name, team }: Props) {
	return (
		<HexPanel bevel={10} padding={SPACING.sm + 2}>
			<Text
				style={styles.name}
				accessibilityRole="header"
				numberOfLines={1}
				adjustsFontSizeToFit
				minimumFontScale={0.7}
			>
				{name}
			</Text>
			<View style={styles.row}>
				{/* Un champion n'est jamais tiré deux fois : son id suffit comme clé. */}
				{team.map((player) => (
					<ChampionTile key={player.champion.id} player={player} />
				))}
			</View>
		</HexPanel>
	);
}

const styles = StyleSheet.create({
	name: {
		fontFamily: FONTS.displayMedium,
		fontSize: 11,
		letterSpacing: 1.2,
		textTransform: "uppercase",
		textAlign: "center",
		color: HEXTECH.gold2,
		marginBottom: SPACING.sm,
	},
	row: {
		flexDirection: "row",
		gap: 6,
	},
});

import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONTS, HEXTECH } from "@/constants/theme";
import { CHAMPION_IMAGES } from "@/lib/championImages";
import type { DrawnPlayer } from "@/lib/draw";

type Props = {
	player: DrawnPlayer;
};

/** Portrait du champion tiré, avec le pseudo du joueur et le nom du champion en surimpression. */
export function ChampionTile({ player }: Props) {
	// Un tirage persisté peut viser un champion retiré depuis (liste resynchronisée) : le fond gris
	// reste alors affiché à la place du portrait.
	const source = CHAMPION_IMAGES[player.champion.slug];

	return (
		<View
			style={styles.tile}
			accessible
			accessibilityLabel={`${player.name} joue ${player.champion.name}`}
		>
			{source && <Image source={source} style={StyleSheet.absoluteFill} contentFit="cover" />}
			<LinearGradient
				colors={["transparent", "rgba(1, 10, 19, 0.85)", HEXTECH.black]}
				locations={[0.35, 0.72, 1]}
				style={styles.caption}
			>
				<Text style={styles.player} numberOfLines={1}>
					{player.name}
				</Text>
				<Text style={styles.champion} numberOfLines={1}>
					{player.champion.name}
				</Text>
			</LinearGradient>
		</View>
	);
}

const styles = StyleSheet.create({
	tile: {
		flex: 1,
		aspectRatio: 1,
		overflow: "hidden",
		borderWidth: 1,
		borderColor: HEXTECH.gold4,
		backgroundColor: HEXTECH.grey4,
	},
	caption: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: "flex-end",
		alignItems: "center",
		paddingHorizontal: 4,
		paddingBottom: 5,
	},
	player: {
		fontFamily: FONTS.body,
		fontSize: 11,
		color: COLORS.textMuted,
	},
	champion: {
		fontFamily: FONTS.display,
		fontSize: 12,
		color: COLORS.text,
	},
});

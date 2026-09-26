import { type PropsWithChildren, useState } from "react";
import {
	type LayoutChangeEvent,
	type StyleProp,
	StyleSheet,
	View,
	type ViewStyle,
} from "react-native";
import Svg, { Defs, LinearGradient, Polygon, Stop } from "react-native-svg";
import { BEVEL, HEXTECH, SPACING } from "@/constants/theme";

type Props = PropsWithChildren<{
	style?: StyleProp<ViewStyle>;
	/** Taille des coins biseautés (haut-gauche et bas-droit). */
	bevel?: number;
	padding?: number;
}>;

/**
 * Panneau à coins biseautés et liseré doré, la signature visuelle de l'app (équivalent de
 * l'utilitaire `hex-panel` du site). React Native n'a pas de `clip-path` : le fond et le cadre
 * sont dessinés en SVG, à la taille mesurée du contenu.
 */
export function HexPanel({ style, bevel = BEVEL, padding = SPACING.md, children }: Props) {
	const [size, setSize] = useState({ width: 0, height: 0 });

	const onLayout = (event: LayoutChangeEvent) => {
		const { width, height } = event.nativeEvent.layout;
		if (width !== size.width || height !== size.height) setSize({ width, height });
	};

	const { width: w, height: h } = size;
	const points = `${bevel},0.5 ${w - 0.5},0.5 ${w - 0.5},${h - bevel} ${w - bevel},${h - 0.5} 0.5,${h - 0.5} 0.5,${bevel}`;

	return (
		<View style={[styles.root, { padding }, style]} onLayout={onLayout}>
			{w > 0 && (
				<Svg width={w} height={h} style={styles.background} pointerEvents="none">
					<Defs>
						<LinearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
							<Stop offset="0" stopColor={HEXTECH.blue7} />
							<Stop offset="1" stopColor={HEXTECH.blue6} />
						</LinearGradient>
						<LinearGradient id="stroke" x1="0" y1="0" x2="1" y2="1">
							<Stop offset="0" stopColor={HEXTECH.gold3} />
							<Stop offset="0.35" stopColor={HEXTECH.gold5} />
							<Stop offset="0.65" stopColor={HEXTECH.gold5} />
							<Stop offset="1" stopColor={HEXTECH.gold4} />
						</LinearGradient>
					</Defs>
					<Polygon points={points} fill="url(#fill)" stroke="url(#stroke)" strokeWidth={1} />
				</Svg>
			)}
			{children}
		</View>
	);
}

const styles = StyleSheet.create({
	// Le panneau isole sa pile d'affichage : le fond SVG (zIndex -1) reste sous tout le contenu,
	// même les éléments que le web ne positionne pas (champs de saisie).
	root: {
		zIndex: 0,
	},
	background: {
		...StyleSheet.absoluteFill,
		zIndex: -1,
	},
});

import { router } from "expo-router";
import { Component, type ErrorInfo, type ReactNode } from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HextechButton } from "@/components/ui/HextechButton";
import { COLORS, FONTS, SPACING } from "@/constants/theme";

type Props = { children: ReactNode };
type State = { error: Error | null };

/**
 * Filet de sécurité pour une erreur de rendu imprévue : sans lui, un bug en build de production
 * ferme toute l'app au lieu d'afficher un écran de récupération. Les données persistées (pseudos,
 * sauvegardes, dernier tirage) ne sont pas touchées.
 */
export class ErrorBoundary extends Component<Props, State> {
	state: State = { error: null };

	static getDerivedStateFromError(error: Error): State {
		return { error };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		console.error("Erreur non interceptée :", error, info.componentStack);
	}

	handleReset = () => {
		this.setState({ error: null });
		router.replace("/");
	};

	render() {
		if (!this.state.error) return this.props.children;

		return (
			<SafeAreaView style={styles.container}>
				<Text style={styles.title}>Une erreur est survenue</Text>
				<Text style={styles.message}>
					L'application a rencontré un problème inattendu. Tes pseudos et tes groupes restent
					enregistrés sur l'appareil.
				</Text>
				<HextechButton label="Revenir à l'accueil" onPress={this.handleReset} />
			</SafeAreaView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.background,
		alignItems: "center",
		justifyContent: "center",
		padding: SPACING.lg,
		gap: SPACING.md,
	},
	title: {
		fontFamily: FONTS.display,
		fontSize: 20,
		color: COLORS.text,
	},
	message: {
		fontFamily: FONTS.body,
		textAlign: "center",
		color: COLORS.textMuted,
	},
});

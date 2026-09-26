import { Cinzel_600SemiBold, Cinzel_700Bold } from "@expo-google-fonts/cinzel";
import {
	Inter_400Regular,
	Inter_500Medium,
	Inter_600SemiBold,
	useFonts,
} from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { COLORS, FONTS } from "@/constants/theme";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		Cinzel_600SemiBold,
		Cinzel_700Bold,
		Inter_400Regular,
		Inter_500Medium,
		Inter_600SemiBold,
	});

	useEffect(() => {
		if (loaded || error) SplashScreen.hideAsync();
	}, [loaded, error]);

	// Sans les polices, les titres en Cinzel s'afficheraient un instant en police système.
	if (!loaded && !error) return null;

	return (
		<GestureHandlerRootView style={{ flex: 1, backgroundColor: COLORS.background }}>
			<SafeAreaProvider>
				<StatusBar style="light" />
				<ErrorBoundary>
					<Stack
						screenOptions={{
							headerStyle: { backgroundColor: COLORS.background },
							headerTintColor: COLORS.primary,
							headerTitleStyle: { fontFamily: FONTS.display, color: COLORS.text },
							headerShadowVisible: false,
							contentStyle: { backgroundColor: COLORS.background },
						}}
					>
						<Stack.Screen name="index" options={{ headerShown: false }} />
						<Stack.Screen name="results" options={{ title: "Résultat" }} />
						<Stack.Screen name="saves" options={{ title: "Mes groupes", presentation: "modal" }} />
					</Stack>
				</ErrorBoundary>
			</SafeAreaProvider>
		</GestureHandlerRootView>
	);
}

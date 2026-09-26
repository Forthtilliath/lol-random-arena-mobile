import * as Haptics from "expo-haptics";

// Alias sémantiques autour d'expo-haptics. Chaque appel est best-effort : une vibration ratée ne
// doit jamais faire échouer l'action qu'elle accompagne.

/** Retour léger pour une pression sur un bouton ou un pas de compteur. */
export function tapFeedback(): void {
	Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

/** Retour pour une sélection ou une bascule. */
export function selectFeedback(): void {
	Haptics.selectionAsync().catch(() => {});
}

/** Retour pour une action qui aboutit (tirage terminé). */
export function successFeedback(): void {
	Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
}

/** Retour pour une action qui échoue. */
export function errorFeedback(): void {
	Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
}

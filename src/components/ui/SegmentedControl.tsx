import {
	SegmentedToggle,
	type SegmentedToggleOption,
} from "@forthtilliath/react-native-kit/components/picker/SegmentedToggle";
import { selectFeedback } from "@forthtilliath/react-native-kit/utils/helpers/haptics";
import { COLORS, FONTS, HEXTECH, SPACING } from "@/constants/theme";

type Props<T extends string> = {
	options: readonly SegmentedToggleOption<T>[];
	value: T;
	onChange: (value: T) => void;
	/** Décrit le choix pour le lecteur d'écran. */
	label: string;
};

/** Onglets exclusifs (format Duos/Trios, critère de bannissement) aux couleurs Hextech. */
export function SegmentedControl<T extends string>({ value, onChange, ...props }: Props<T>) {
	return (
		<SegmentedToggle
			{...props}
			value={value}
			onChange={(next) => {
				if (next !== value) selectFeedback();
				onChange(next);
			}}
			styles={STYLES}
		/>
	);
}

// fontWeight à "normal" : sur Android, un poids explicite fait ignorer la police chargée.
const STYLES = {
	row: {
		gap: SPACING.sm,
		marginBottom: 0,
	},
	button: {
		justifyContent: "center",
		gap: 2,
		paddingVertical: 10,
		paddingHorizontal: SPACING.xs,
		borderRadius: 0,
		borderColor: COLORS.borderMuted,
		backgroundColor: "rgba(1, 10, 19, 0.6)",
	},
	buttonActive: {
		borderColor: HEXTECH.gold2,
		backgroundColor: "rgba(70, 55, 20, 0.45)",
	},
	text: {
		fontFamily: FONTS.displayMedium,
		fontWeight: "normal",
		fontSize: 13,
		letterSpacing: 1.2,
		textTransform: "uppercase",
		color: COLORS.textMuted,
	},
	textActive: {
		color: COLORS.text,
	},
	hint: {
		fontFamily: FONTS.body,
		fontSize: 11,
		marginTop: 0,
		color: COLORS.textFaint,
	},
	hintActive: {
		color: COLORS.textMuted,
	},
} as const;

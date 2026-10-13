import { QuantityStepper } from "@forthtilliath/react-native-kit/components/picker/QuantityStepper";
import { tapFeedback } from "@forthtilliath/react-native-kit/utils/helpers/haptics";
import { COLORS, FONTS, HEXTECH } from "@/constants/theme";

type Props = {
	value: number;
	onChange: (value: number) => void;
	min: number;
	max: number;
	/** Ce que compte le compteur, repris par le lecteur d'écran (« Retirer : bannissements »). */
	label: string;
};

/** Compteur −/+ borné aux couleurs Hextech. Un appui long saute de 5 en 5. */
export function NumberStepper({ value, onChange, ...props }: Props) {
	return (
		<QuantityStepper
			{...props}
			value={value}
			onChange={(next) => {
				if (next !== value) tapFeedback();
				onChange(next);
			}}
			longPressStep={5}
			styles={STYLES}
		/>
	);
}

// fontWeight à "normal" : sur Android, un poids explicite fait ignorer la police chargée.
const STYLES = {
	row: {
		alignItems: "stretch",
		gap: 0,
		borderWidth: 1,
		borderColor: HEXTECH.gold4,
	},
	button: {
		width: 42,
		height: 42,
		borderRadius: 0,
		backgroundColor: HEXTECH.grey4,
	},
	buttonDisabled: {
		opacity: 0.4,
	},
	buttonText: {
		fontFamily: FONTS.bodyBold,
		fontWeight: "normal",
		color: COLORS.primary,
	},
	input: {
		height: 42,
		borderRadius: 0,
		borderWidth: 0,
		borderLeftWidth: 1,
		borderRightWidth: 1,
		borderColor: HEXTECH.gold4,
		fontFamily: FONTS.bodyBold,
		fontWeight: "normal",
		fontSize: 16,
		color: COLORS.text,
		backgroundColor: COLORS.background,
	},
} as const;

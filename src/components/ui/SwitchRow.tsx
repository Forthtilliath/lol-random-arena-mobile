import { SwitchRow as KitSwitchRow } from "@forthtilliath/react-native-kit/components/settings/SwitchRow";
import { selectFeedback } from "@forthtilliath/react-native-kit/utils/helpers/haptics";
import { COLORS, FONTS, HEXTECH, SPACING } from "@/constants/theme";

type Props = {
	label: string;
	description: string;
	value: boolean;
	onChange: (value: boolean) => void;
};

/** SwitchRow du kit aux couleurs Hextech, avec retour haptique à chaque bascule. */
export function SwitchRow({ onChange, ...props }: Props) {
	return (
		<KitSwitchRow
			{...props}
			onChange={(next) => {
				selectFeedback();
				onChange(next);
			}}
			colors={COLORS_SWITCH}
			styles={STYLES}
		/>
	);
}

const COLORS_SWITCH = {
	trackOff: HEXTECH.grey3,
	trackOn: HEXTECH.blue3,
	thumbOff: HEXTECH.grey1,
	thumbOn: HEXTECH.blue1,
};

const STYLES = {
	row: {
		gap: SPACING.md,
		paddingVertical: SPACING.sm + 4,
		paddingHorizontal: SPACING.md,
		borderWidth: 1,
		borderColor: "rgba(60, 60, 65, 0.7)",
		backgroundColor: "rgba(1, 10, 19, 0.5)",
	},
	// fontWeight à "normal" : sur Android, un poids explicite fait ignorer la police chargée.
	label: {
		fontFamily: FONTS.bodyBold,
		fontWeight: "normal",
		fontSize: 14,
		color: COLORS.text,
	},
	description: {
		fontFamily: FONTS.body,
		fontSize: 12,
		color: COLORS.textMuted,
	},
} as const;

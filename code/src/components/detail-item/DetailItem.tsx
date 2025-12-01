import AppBox from "@/components/app-box/AppBox";
import AppTypography from "@/components/app-typography/AppTypography";
import { DetailItemProps } from "@/components/detail-item/DetailItem.types"

import "@/components/detail-item/DetailItem.scss";

const DetailItem = ({ labelTranslationKey, value }: DetailItemProps) => (
    <AppBox className="detail-item">
        <AppTypography
            fontWeight="extra-bold"
            translationKey={labelTranslationKey}
            className="detail-item__info-label"
        />
        <AppTypography
            fontWeight="bold"
            className="detail-item__info-value"
        >
            {value}
        </AppTypography>
    </AppBox>
);

export default DetailItem;

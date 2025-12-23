import AppBox from "@/components/app-box/AppBox";
import AppTypography from "@/components/app-typography/AppTypography";

import "@/components/draft-label/DraftLabel.scss";

const DraftLabel = () => {
    return (
        <AppBox className="draft-label">
            <AppTypography variant="caption-small" translationKey="productsTable.label.draft" />
        </AppBox>
    );
}

export default DraftLabel;

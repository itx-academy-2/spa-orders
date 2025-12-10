import AppBox from "@/components/app-box/AppBox";
import AppButton from "@/components/app-button/AppButton";
import AppTypography from "@/components/app-typography/AppTypography";

import { SuggestedKeywordsProps } from "@/containers/modals/image-search-modal/components/suggested-keywords/SuggestedKeywords.types";

import * as styles from "@/containers/modals/image-search-modal/components/suggested-keywords/SuggestedKeywords.module.scss";

const SuggestedKeywords = ({ keywords, onKeywordClick }: SuggestedKeywordsProps) => {
    return (
        <AppBox className={styles.suggestedKeywords}>
            {keywords.map((keyword) => (
                <AppButton
                    key={keyword}
                    className={styles.suggestedKeywords_box}
                    onClick={() => onKeywordClick(keyword)}
                    variant="outlined"
                >
                    <AppTypography className={styles.suggestedKeywords_keyword}>
                        {keyword}
                    </AppTypography>
                </AppButton>
            ))
            }
        </AppBox >
    );
};

export default SuggestedKeywords;

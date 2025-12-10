import AppBox from "@/components/app-box/AppBox";
import AppTypography from "@/components/app-typography/AppTypography";

import { SuggestedKeywordsProps } from "@/containers/modals/image-search-modal/components/suggested-keywords/SuggestedKeywords.types";

import * as styles from "@/containers/modals/image-search-modal/components/suggested-keywords/SuggestedKeywords.module.scss";

const SuggestedKeywords = ({ keywords, onKeywordClick }: SuggestedKeywordsProps) => {
    return (
        <AppBox className={styles.suggestedKeywords}>
            {keywords.map((keyword) => (
                <AppBox
                    key={keyword}
                    className={styles.suggestedKeywords_box}
                    onClick={() => onKeywordClick(keyword)}
                >
                    <AppTypography className={styles.suggestedKeywords_keyword}>
                        {keyword}
                    </AppTypography>
                </AppBox>
            ))
            }
        </AppBox >
    );
};

export default SuggestedKeywords;

import { useSearchParams } from "react-router-dom";

import { sortOptions } from "@/containers/user-account/my-reservations/MyReservations.constants";

import AppBox from "@/components/app-box/AppBox";
import AppContainer from "@/components/app-container/AppContainer";
import AppTypography from "@/components/app-typography/AppTypography";
import AppDropdown from "@/components/app-dropdown/AppDropdown";

import * as styles from "@/containers/user-account/my-reservations/MyReservations.module.scss";

const MyReservations = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const sortOption = searchParams.get("sort");

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(searchParams);

        if (value) {
            params.set("sort", value);
        } else {
            params.delete("sort");
        }

        setSearchParams(params);
    };

    const productsCount = 0;

    const defaultDropdownText = sortOptions.find(
        (item: { value: string | null; }) => item.value === sortOption
    )?.label || <AppTypography
            translationKey="sortOptions.newest"
            data-testid="default-sort-label"
        />;

    return (
        <AppContainer className={styles.MyReservations}>
            <AppBox className={styles.MyReservations_header}>
                <AppTypography variant="h3" translationKey="MyReservations.title" />
            </AppBox>
            <AppBox className={styles.MyReservations_info}>
                <AppTypography className={styles.MyReservations_count} component="span">
                    <AppTypography
                        translationKey="MyReservations.productsCount"
                        component="span"
                        translationProps={{ values: { count: productsCount } }}
                    />
                </AppTypography>
                <AppDropdown
                    key={sortOption}
                    options={sortOptions}
                    onSelect={handleSortChange}
                    defaultLabel={defaultDropdownText}
                    className={styles.MyReservations_sort}
                />
            </AppBox>
        </AppContainer>
    );
};

export default MyReservations;
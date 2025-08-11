import AppBox from "@/components/app-box/AppBox";
import AppContainer from "@/components/app-container/AppContainer";
//import AppLoader from "@/components/app-loader/AppLoader";
import AppTypography from "@/components/app-typography/AppTypography";

import * as styles from "@/containers/user-account/my-addresses/MyAddresses.module.scss";

const MyAddresses = () => {
    // if (isLoading) {
    //     return <AppLoader size="extra-large" className={styles.Profile__loader} />;
    // }

    //if (!user) return null;

    return (
        <AppContainer className={styles.MyAddresses}>
            <AppBox className={styles.MyAddresses_header}>
                <AppTypography variant="h3" translationKey="myAddresses.title" />
            </AppBox>
        </AppContainer>
    );
};

export default MyAddresses;


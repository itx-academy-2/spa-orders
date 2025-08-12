import AppBox from "@/components/app-box/AppBox";
import AppContainer from "@/components/app-container/AppContainer";
import AppLoader from "@/components/app-loader/AppLoader";
import AppTypography from "@/components/app-typography/AppTypography";
import AddressCard from "@/components/address-card/AddressCard";

import { useGetUserAddressesQuery } from "@/store/api/addressApi";

import * as styles from "@/containers/user-account/my-addresses/MyAddresses.module.scss";
import { useUserDetailsSelector } from "@/store/slices/userSlice";

const MyAddresses = () => {    
    const user = useUserDetailsSelector();
    const userId = user?.id; 

    if (typeof userId !== "number") {
        throw new Error("UserId is required and must be a number");
    }
    
    const { data: addresses, isLoading, isError } = useGetUserAddressesQuery({ userId });
    
    if (isLoading) {
        return <AppLoader size="extra-large" className={styles.MyAddresses_loader} />;
    }

    const isEmpty = !isLoading && addresses?.length === 0;

    if (isEmpty) {
        return (
            <AppContainer className={styles.MyAddresses_emptyMessage}>
                <AppTypography variant="body" translationKey="myAddresses.emptyMessage" />
            </AppContainer>
        );
    }

    if (isError) {
        console.error("Error fetching user addresses:", isError);
        return (
            <AppBox className={styles.MyAddresses_error} data-cy="my-addresses-error">
                <AppTypography
                    variant="subtitle2"
                    fontWeight="semi-bold"
                    translationKey="myAddresses.error.label"
                    data-cy="my-addresses-error-label"
                />
            </AppBox>
        );
    }

    return (
        <AppContainer className={styles.MyAddresses}>
            <AppBox className={styles.MyAddresses_header}>
                <AppTypography variant="h3" translationKey="myAddresses.title" />
            </AppBox>
            <AppBox className={styles.MyAddresses_list}>
                {(addresses ?? []).map((addr) => (
                    <AddressCard
                        key={addr.id}
                        address={{
                            ...addr,
                            postMethod: addr.deliveryMethod ?? "",
                        }}
                    />
                ))}
            </AppBox>
        </AppContainer>
    );
};

export default MyAddresses;

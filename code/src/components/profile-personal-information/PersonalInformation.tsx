import AppBox from "@/components/app-box/AppBox";
import AppButton from "@/components/app-button/AppButton";
import AppContainer from "@/components/app-container/AppContainer";
import AppInput from "@/components/app-input/AppInput";
import AppTypography from "@/components/app-typography/AppTypography";

import EditPersonalInfoModal from "@containers/modals/user-account/EditPersonalInfoModal";

import { useGetUserInfoQuery } from "@/store/api/userProfileApi";
import { useModalContext } from "@/context/modal/ModalContext";

import * as styles from "@/components/profile-personal-information/PersonalInformation.module.scss";

const PersonalInformation = () => {
    const { data: user } = useGetUserInfoQuery();
    const { openModal } = useModalContext();

    if (!user) return null;

    const handleChangePersonalInformation = () => {
        if (!user) return;

        openModal(
            <EditPersonalInfoModal
            firstName={user.firstName}
            lastName={user.lastName}
            phone={user.phone}
            />
        );
    };

    return (
        <AppContainer className="spa-personal-information__container">
            <AppTypography
                className="spa-personal-information__title"
                translationKey="personalInformation.title"
            />
            <AppBox className="spa-personal-information__first-last-names-container">
                <AppInput
                    value={user.firstName}
                    labelTranslationKey="personalInformation.firstName.field"
                    disabled
                    fullWidth
                    data-cy="personal-information-first-name"
                />
                <AppInput
                    value={user.lastName}
                    labelTranslationKey="personalInformation.lastName.field"
                    disabled
                    fullWidth
                    data-cy="personal-information-last-name"
                />
            </AppBox>
            <AppBox className="spa-personal-information__phone-container">
                <AppInput
                    value={user?.phone || ""}
                    labelTranslationKey="personalInformation.phone.field"
                    disabled
                    fullWidth
                    data-cy="personal-information-phone"
                />
            </AppBox>
            <AppButton
                size="large"
                className="spa-personal-information__change-button"
                fullWidth
                type="button"
                onClick={handleChangePersonalInformation}
                data-cy="personal-information-change-button"
                >
                <AppTypography
                    variant="subtitle2"
                    component="span"
                    translationKey="personalInformation.changeButton"
                    fontWeight="extra-bold"
                />
            </AppButton>
        </AppContainer>
    );
};

export default PersonalInformation;

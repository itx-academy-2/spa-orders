import AppBox from "@/components/app-box/AppBox";
import AppContainer from "@/components/app-container/AppContainer";
import AppLoader from "@/components/app-loader/AppLoader";
import AppTypography from "@/components/app-typography/AppTypography";
import EmailAndPassword from "@/components/profile-email-password/EmailAndPassword";
import PersonalInformation from "@/components/profile-personal-information/PersonalInformation";

import { useGetUserInfoQuery } from "@/store/api/userProfileApi";

import * as styles from "@/containers/user-account/profile/Profile.module.scss";

const Profile = () => {
  const { data: user, isLoading, isError } = useGetUserInfoQuery();

  if (isLoading) {
    return <AppLoader size="extra-large" className={styles.Profile__loader} />;
  }

  if (isError) {
    return (
      <AppBox className={styles.Profile} data-cy="profile-error">
        <AppTypography
          variant="subtitle2"
          fontWeight="semi-bold"
          translationKey="profile.error.label"
          data-cy="profile-error-label"
        />
      </AppBox>
    );
  }

  if (!user) return null;

  return (
    <AppContainer className={styles.Profile}>
      <AppTypography variant="h3" translationKey="profile.title" />
      <PersonalInformation
        firstName={user.firstName}
        lastName={user.lastName}
        phone={user.phone || ""}
      />
      <AppBox className={styles.Profile__divider} />
      <EmailAndPassword email={user.email} />
    </AppContainer>
  );
};

export default Profile;

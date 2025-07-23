import AppBox from "@/components/app-box/AppBox";
import AppContainer from "@/components/app-container/AppContainer";
import AppTypography from "@/components/app-typography/AppTypography";
import EmailAndPassword from "@/components/profile-email-password/EmailAndPassword";
import PersonalInformation from "@/components/profile-personal-information/PersonalInformation";

import { useGetUserInfoQuery } from "@/store/api/userProfileApi";

import * as styles from "@/containers/user-account/profile/Profile.module.scss";

const Profile = () => {
  const { data: user } = useGetUserInfoQuery();

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

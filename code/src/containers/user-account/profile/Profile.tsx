import AppContainer from "@/components/app-container/AppContainer"
import AppTypography from "@/components/app-typography/AppTypography";
import PersonalInformation from "@/components/profile-personal-information/PersonalInformation";

import * as styles from "@/containers/user-account/profile/Profile.module.scss";

const Profile = () => {
  return (
    <AppContainer className={styles.Profile}>
      <AppTypography
        variant="h3"
        translationKey="profile.title"
      />
      <PersonalInformation />
    </AppContainer>
  );
};

export default Profile;

import AppContainer from "@/components/app-container/AppContainer"
import PersonalInformation from "@/components/profile-personal-information/PersonalInformation";

import * as styles from "@/containers/user-account/profile/Profile.module.scss";

const Profile = () => {
  return (
    <AppContainer className={styles.Profile}>
        <PersonalInformation />
    </AppContainer>
  );
};

export default Profile;

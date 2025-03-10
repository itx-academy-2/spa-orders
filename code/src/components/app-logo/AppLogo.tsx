import AppBox from "@/components/app-box/AppBox";
import { AppLogoType } from "@/components/app-logo/AppLogo.types";

import logo from "@/assets/images/logo.png";
import cn from "@/utils/cn/cn";

export const COMPONENT = "img";

const AppLogo = ({ className, ...props }: AppLogoType) => {
  return (
    <AppBox
      component={COMPONENT}
      src={logo}
      alt="App logo"
      className={cn("spa-logo", className)}
      {...props}
    />
  );
};

export default AppLogo;

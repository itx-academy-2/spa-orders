import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

import { getHeaderMenuList } from "@/layouts/header/utils/get-header-menu-list/getHeaderMenuList";

import AppBox from "@/components/app-box/AppBox";
import AppIconButton from "@/components/app-icon-button/AppIconButton";
import AppMenu from "@/components/app-menu/AppMenu";

import useLogout from "@/hooks/use-logout/useLogout";
import { useGetUserInfoQuery } from "@/store/api/userProfileApi";

import { rawMenuItems } from "./HeaderAccountButton.constants";

const HeaderAccountButton = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleLogout = useLogout();
  const { data } = useGetUserInfoQuery();

  const profilePhoto = data?.photo;

  const profileIconOrPhoto = profilePhoto ? (
    <AppBox className="header__toolbar-profile-img-wrapper">
      <AppBox
        component="img"
        src={profilePhoto}
        alt="Profile photo"
        className="header__toolbar-profile-img"
        data-testid="header-account-photo"
      />
    </AppBox>
  ) : (
    <AccountCircleRoundedIcon
      className="header__toolbar-icon"
      fontSize="medium"
    />
  );

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuList = getHeaderMenuList(rawMenuItems, navigate, handleLogout);

  return (
    <>
      <AppIconButton
        data-cy="header-account-button"
        data-testid="header-account-button"
        onClick={handleClick}
      >
        {profileIconOrPhoto}
      </AppIconButton>
      <AppMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        items={menuList}
      />
    </>
  );
};

export default HeaderAccountButton;

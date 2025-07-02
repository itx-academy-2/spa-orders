import { useState } from "react";
import { useNavigate } from "react-router-dom";

import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";

import { getHeaderMenuList } from "@/layouts/header/components/header-buttons/header-account-button/HeaderAccountButton.constants";

import AppIconButton from "@/components/app-icon-button/AppIconButton";
import AppMenu from "@/components/app-menu/AppMenu";

import useLogout from "@/hooks/use-logout/useLogout";

const HeaderAccountButton = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleLogout = useLogout();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuList = getHeaderMenuList(navigate, handleLogout);

  return (
    <>
      <AppIconButton
        data-cy="header-account-button"
        data-testid="header-account-button"
        onClick={handleClick}
      >
        <AccountCircleRoundedIcon
          className="header__toolbar-icon"
          fontSize="medium"
        />
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

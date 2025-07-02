import Menu from "@mui/material/Menu";

import AppMenuItem from "@/components/app-menu-item/AppMenuItem";
import { AppMenuProps } from "@/components/app-menu/AppMenu.types";
import AppTypography from "@/components/app-typography/AppTypography";

const AppMenu = ({ anchorEl, open, onClose, items }: AppMenuProps) => {
  return (
    <Menu
      className="spa-menu"
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
    >
      {items.map(({ id, name, icon: Icon, onClick }) => (
        <AppMenuItem
          key={id}
          onClick={() => {
            onClick();
            onClose();
          }}
          data-cy={`${name}-item`}
        >
          <Icon className="header__toolbar-icon-dropdown" fontSize="medium" />
          <AppTypography variant="subtitle2" translationKey={name} />
        </AppMenuItem>
      ))}
    </Menu>
  );
};

export default AppMenu;

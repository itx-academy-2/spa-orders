import Menu from "@mui/material/Menu";

import AppMenuItem from "@/components/app-menu-item/AppMenuItem";
import { AppMenuProps } from "@/components/app-menu/AppMenu.types";
import AppTypography from "@/components/app-typography/AppTypography";

import * as styles from "@/components/app-menu/AppMenu.module.scss";

const AppMenu = ({ anchorEl, open, onClose, items }: AppMenuProps) => {
  const content =
    items.length > 0 ? (
      items.map(({ id, name, icon: Icon, onClick }) => (
        <AppMenuItem
          key={id}
          onClick={() => {
            onClick();
            onClose();
          }}
          data-cy={`${name}-item`}
          className={styles.spaMenu_item}
        >
          <Icon className="header__toolbar-icon-dropdown" fontSize="medium" />
          <AppTypography variant="subtitle2" translationKey={name} />
        </AppMenuItem>
      ))
    ) : (
      <AppMenuItem disabled>
        <AppTypography variant="caption" translationKey="appMenu.noOptions" />
      </AppMenuItem>
    );

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          className: styles.spaMenu
        }
      }}
    >
      {content}
    </Menu>
  );
};

export default AppMenu;

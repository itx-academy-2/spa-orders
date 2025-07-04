import { RawMenuItem } from "@/layouts/header/components/header-buttons/header-account-button/HeaderAccountButton.constants";

import type { MenuItem } from "@/components/app-menu/AppMenu.types";

export const getHeaderMenuList = (
  items: RawMenuItem[],
  navigate: (path: string) => void,
  handleLogout: () => void
): MenuItem[] =>
  items.map(
    ({ id, name, icon, action }): MenuItem => ({
      id,
      name,
      icon,
      onClick:
        action.type === "logout" ? handleLogout : () => navigate(action.path)
    })
  );

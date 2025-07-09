import type { SvgIconComponent } from "@mui/icons-material";

export interface MenuItem {
  id: number;
  name: string;
  icon: SvgIconComponent;
  onClick: () => void;
}
export interface AppMenuProps {
  anchorEl: HTMLElement | null;
  open: boolean;
  onClose: () => void;
  items: MenuItem[];
}

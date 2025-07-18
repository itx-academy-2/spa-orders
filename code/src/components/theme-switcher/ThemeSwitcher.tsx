import Switch from "@mui/material/Switch";

import { useThemeContext } from "@/context/theme/ThemeContext";

import "./ThemeSwitcher.scss";

export default function ThemeSwitcher() {
  const { toggleTheme } = useThemeContext();

  return (
    <Switch
      disableRipple
      className="theme-switch-root"
      onChange={toggleTheme}
      classes={{
        switchBase: "theme-switch-base",
        thumb: "theme-switch-thumb",
        track: "theme-switch-track"
      }}
    />
  );
}

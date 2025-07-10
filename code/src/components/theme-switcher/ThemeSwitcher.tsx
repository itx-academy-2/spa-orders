import Switch from "@mui/material/Switch";

import "./ThemeSwitcher.scss";

export default function ThemeSwitcher() {
  return (
    <Switch
      disableRipple
      className="theme-switch-root"
      classes={{
        switchBase: "theme-switch-base",
        thumb: "theme-switch-thumb",
        track: "theme-switch-track"
      }}
    />
  );
}

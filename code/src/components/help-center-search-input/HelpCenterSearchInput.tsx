import { ChangeEvent, useRef, useState } from "react";
import { useIntl } from "react-intl";

import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";

import AppBox from "@/components/app-box/AppBox";
import AppIconButton from "@/components/app-icon-button/AppIconButton";
import AppInputBase from "@/components/app-input-base/AppInputBase";
import HelpCenterSearchDropdownContainer from "@/components/help-center-search-dropdown/help-center-search-dropdown-container/HelpCenterSearchDropdownContainer";

import useDropdown from "@/hooks/use-dropdown/useDropdown";
import { useOnClickOutside } from "@/hooks/use-on-click-outside/useOnClickOutside";
import cn from "@/utils/cn/cn";

import "@/components/help-center-search-input/HelpCenterSearchInput.scss";

const HelpCenterSearchInput = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { formatMessage } = useIntl();
  const { isDropdownOpened, handleOpenDropdown, handleCloseDropdown } =
    useDropdown();

  const searchInputRef = useRef<HTMLDivElement | null>(null);
  useOnClickOutside(searchInputRef, handleCloseDropdown);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchQuery(value);

    if (value.length) {
      handleOpenDropdown();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    handleCloseDropdown();
  };

  const canShowResults = searchQuery.length >= 3;

  return (
    <AppBox
      className="help-center-search-input"
      ref={searchInputRef}
      data-testid="help-center-search-input"
    >
      <AppInputBase
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder={formatMessage({ id: "helpCenter.searchbar.placeholder" })}
        className={cn("help-center-search-input__text-field")}
      />

      <AppIconButton onClick={handleClearSearch}>
        <ClearIcon fontSize="small" />
      </AppIconButton>
      <AppIconButton size="small" className="help-center-search-input__icon">
        <SearchIcon />
      </AppIconButton>

      {isDropdownOpened && canShowResults && (
        <HelpCenterSearchDropdownContainer query={searchQuery} />
      )}
    </AppBox>
  );
};

export default HelpCenterSearchInput;

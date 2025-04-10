import AppBox from "@/components/app-box/AppBox";
import AppMenuItem from "@/components/app-menu-item/AppMenuItem";
import AppTypography from "@/components/app-typography/AppTypography";

type HelpCenterSearchInputDropdownProps = {
  searchResults: { id: number; title: string }[];
  onResultClick?: (articleId: number) => void;
  handleCloseDropdown?: () => void;
};

const HelpCenterSearchInputDropdown = ({
  searchResults,
  onResultClick,
  handleCloseDropdown
}: HelpCenterSearchInputDropdownProps) => {
  return (
    <AppBox
      data-testid="search-dropdown"
      component="ul"
      className="help-center-search-input-dropdown"
    >
      {searchResults.map((article) => (
        <AppMenuItem
          key={article.id}
          className="help-center-search-input-dropdown__item"
          onClick={() => {
            onResultClick?.(article.id);
            handleCloseDropdown?.();
          }}
        >
          <AppTypography variant="caption-small">{article.title}</AppTypography>
        </AppMenuItem>
      ))}
    </AppBox>
  );
};

export default HelpCenterSearchInputDropdown;

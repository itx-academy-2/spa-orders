import { useLocation, useSearchParams } from "react-router-dom";

import { categories } from "@/layouts/header/components/header-categories/HeaderCategories.constants";

import AppBox from "@/components/app-box/AppBox";
import AppContainer from "@/components/app-container/AppContainer";
import AppLink from "@/components/app-link/AppLink";
import AppTypography from "@/components/app-typography/AppTypography";

import "@/layouts/header/components/header-categories/HeaderCategories.scss";

const HeaderCategories = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const categoryType = searchParams.get("category");

  return (
    <AppBox className="menu">
      <AppContainer maxWidth="xl" className="menu__container">
        {categories.map((category, index) => {
          let isCategoryActive = false;

          if (category.href === "/products") {
            isCategoryActive =
              location.pathname === "/products" && !categoryType;
          } else if (category.href.includes("?category=")) {
            isCategoryActive = category.href.includes(
              `?category=${categoryType}`
            );
          } else {
            isCategoryActive = location.pathname === category.href;
          }

          return (
            <AppLink
              to={category.href}
              variant="colored"
              isNavLink={isCategoryActive}
              key={category.label}
              className={isCategoryActive ? "active" : ""}
              data-testid="nav-link"
            >
              <AppTypography
                variant="caption"
                data-testid="menu-item"
                translationKey={category.label}
                data-cy={`menu-item-${index}`}
              />
            </AppLink>
          );
        })}
      </AppContainer>
    </AppBox>
  );
};

export default HeaderCategories;

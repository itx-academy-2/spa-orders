import HeaderAccountButton from "@/layouts/header/components/header-buttons/header-account-button/HeaderAccountButton";
import HeaderCartButton from "@/layouts/header/components/header-buttons/header-cart-button/HeaderCartButton";

const HeaderUserToolbar = () => {
  return (
    <>
      <HeaderCartButton />
      <HeaderAccountButton />
    </>
  );
};

export default HeaderUserToolbar;

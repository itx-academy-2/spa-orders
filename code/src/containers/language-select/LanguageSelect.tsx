import AppMenuItem from "@/components/app-menu-item/AppMenuItem";
import AppSelect from "@/components/app-select/AppSelect";
import AppTypography from "@/components/app-typography/AppTypography";

import { LOCAL_STORAGE_KEYS } from "@/constants/common";
import locales from "@/constants/locales";
import { useLocaleContext } from "@/context/i18n/I18nProvider";
import cn from "@/utils/cn/cn";

import "@/containers/language-select/LanguageSelect.scss";

const LanguageSelect = () => {
  const { locale, setLocale } = useLocaleContext();

  const localesItems = locales.map(({ translationKey, key, icon }) => {
    const handleLocaleChange = () => {
      setLocale(key);
      window.localStorage.setItem(LOCAL_STORAGE_KEYS.locale, key);
    };
    return (
      <AppMenuItem
        key={key}
        value={key}
        onClick={handleLocaleChange}
        className={cn("language-select__item", {
          "language-select__item--active": locale === key
        })}
      >
        <svg className="language-select__item-icon">
          <use href={icon} />
        </svg>
        <AppTypography translationKey={translationKey} />
      </AppMenuItem>
    );
  });

  return (
    <AppSelect
      className="language-select__container"
      labelId="language-select"
      inputProps={{
        className: "language-select"
      }}
      defaultValue={locale}
      value={locale}
    >
      {localesItems}
    </AppSelect>
  );
};

export default LanguageSelect;

import { ChangeEvent, useState } from "react";
import { useIntl } from "react-intl";

import AppBox from "@/components/app-box/AppBox";
import AppButton from "@/components/app-button/AppButton";
import AppContainer from "@/components/app-container/AppContainer";
import AppTypography from "@/components/app-typography/AppTypography";
import AppSearchInput from "@/components/app-search-input/AppSearchInput";
import AppLoader from "@/components/app-loader/AppLoader";

import { useGetManagerImageSearchQuery } from "@/store/tanstack-api/modules/products/queries";

import cn from "@/utils/cn/cn";

import * as styles from "@/containers/modals/image-search/components/ImageSearch.module.scss";

type ImageSearchProps = {
  onSelect?: (image: string) => void;
  onSearch: (searchValue: string) => void;
};

const ImageSearch = ({ onSelect, onSearch }: ImageSearchProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const searchQuery = searchValue.length >= 3 ? searchValue : "";
  const { data: images = [], isLoading, error } = useGetManagerImageSearchQuery({ searchQuery });

  const { formatMessage } = useIntl();

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value);

  const handleClearSearch = () => {
    setSearchValue("");
    setSelectedImage(null);
    onSearch("");
  };

  const handleSearch = () => onSearch(searchValue);

  const handleConfirm = () => {
    if (selectedImage && onSelect) {
      onSelect(selectedImage);
      setSelectedImage(null);
      setSearchValue("");
    }
  };

  const handleImageClick = (url: string, e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setSelectedImage(prev => (prev === url ? null : url));
  };

  const getStatusMessage = () => {
    if (error) {
      const status = (error as any).status;
      if (status === 403) return formatMessage({ id: "searchImageModal.error.accessDenied" });
      if (status === 503) return formatMessage({ id: "searchImageModal.error.unavailable" });
      return formatMessage({ id: "searchImageModal.error.generic" });
    }
    if (!searchValue) return formatMessage({ id: "searchImageModal.info.typeKeyword" });
    if (searchValue.length < 3) return formatMessage({ id: "searchImageModal.info.minChars" });
    if (images.length === 0) return formatMessage({ id: "searchImageModal.info.noResults" });
    return null;
  };

  const message = getStatusMessage();

  return (
    <AppContainer className={styles.searchContainer}>
      <AppBox className={styles.searchContainer_searchInputWrapper}>
        <AppSearchInput
          value={searchValue}
          placeholder={formatMessage({
            id: "searchImageModal.search.placeholder"
          })}
          onChange={handleSearchChange}
          onClear={handleClearSearch}
          onSearch={handleSearch}
          className={styles.searchContainer_searchInput}
        />
      </AppBox>
      <AppBox className={styles.searchContainer_imageContent}>
        {isLoading && (
          <AppBox>
            <AppLoader size="medium" />
          </AppBox>
        )}
        {message && !isLoading && (
          <AppTypography
            className={styles.searchContainer_errorMessage}
          >
            {message}
          </AppTypography>
        )}
        {images.length > 0 && (
          <AppBox
            className={styles.searchContainer_imageGrid}
          >
            {images.slice(0, 8).map(url => (
              <AppBox
                key={url}
                className={cn(
                  styles.searchContainer_imageWrapper,
                  selectedImage === url && styles.searchContainer_selectedImage
                )}
                onClick={(e: React.MouseEvent<HTMLDivElement>) => handleImageClick(url, e)}
              >
                <img
                  src={url}
                  alt="product"
                  className={styles.searchContainer_image}
                />
              </AppBox>
            ))}
          </AppBox>
        )}
      </AppBox>
      <AppBox className={styles.searchContainer_buttonWrapper}>
        <AppButton
          onClick={handleConfirm}
          disabled={!selectedImage}
          className={`${styles.searchContainer_selectedImage} ? ${styles.searchContainer_confirmButtonActive} : ${styles.searchContainer_confirmButton}`}
        >
          <AppTypography
            variant="caption"
            translationKey="searchImageModal.confirmButton"
          />
        </AppButton>
      </AppBox>
    </AppContainer>
  );
};

export default ImageSearch;

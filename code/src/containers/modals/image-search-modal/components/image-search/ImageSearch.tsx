import { ChangeEvent, useState } from "react";
import { useIntl } from "react-intl";

import AppBox from "@/components/app-box/AppBox";
import AppButton from "@/components/app-button/AppButton";
import AppContainer from "@/components/app-container/AppContainer";
import AppTypography from "@/components/app-typography/AppTypography";
import AppSearchInput from "@/components/app-search-input/AppSearchInput";
import AppLoader from "@/components/app-loader/AppLoader";

import { ImageSearchProps } from "@/containers/modals/image-search-modal/components/image-search/ImageSearch.types";
import ImageGrid from "@/containers/modals/image-search-modal/components/image-grid/ImageGrid";
import { MAX_IMAGES } from "@/containers/modals/image-search-modal/components/image-search/ImageSearch.constants";
import { useModalContext } from "@/context/modal/ModalContext";
import { useGetManagerImageSearchQuery } from "@/store/tanstack-api/modules/products/queries";

import cn from "@/utils/cn/cn";
import getImageSearchStatus from "@/utils/get-image-seach-status/getImageSearchStatus";

import * as styles from "@/containers/modals/image-search-modal/components/image-search/ImageSearch.module.scss";

const ImageSearch = ({ onSelect, onSearch }: ImageSearchProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { closeModal } = useModalContext();

  const searchQuery = searchValue.length >= 3 ? searchValue : "";
  const { data: images = [], isLoading, error } = useGetManagerImageSearchQuery({ searchQuery });

  const intl = useIntl();

  const resetSearch = () => {
    setSearchValue("");
    setSelectedImage(null);
    onSearch("");
  };

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value);

  const handleClearSearch = () => resetSearch();

  const handleSearch = () => onSearch(searchValue);

  const handleConfirm = () => {
    if (selectedImage && onSelect) {
      onSelect(selectedImage);
      resetSearch();
      closeModal();
    }
  };

  const toggleSelection = (current: string | null, value: string) =>
    current === value ? null : value;

  const message = getImageSearchStatus({ error, searchValue, imagesLength: images.length }, intl);

  return (
    <AppContainer className={styles.searchContainer}>
      <AppBox className={styles.searchContainer_searchInputWrapper}>
        <AppSearchInput
          value={searchValue}
          placeholder={intl.formatMessage({
            id: "searchImageModal.search.placeholder"
          })}
          onChange={handleSearchChange}
          onClear={handleClearSearch}
          onSearch={handleSearch}
          hideSearchIcon
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
          <ImageGrid
            images={images.slice(0, MAX_IMAGES)}
            selectedImage={selectedImage}
            onSelect={(url) => setSelectedImage(toggleSelection(selectedImage, url))}
          />
        )}
      </AppBox>
      <AppBox className={styles.searchContainer_buttonWrapper}>
        <AppButton
          onClick={handleConfirm}
          disabled={!selectedImage}
          className={cn(
            selectedImage ? styles.searchContainer_confirmButtonActive : styles.searchContainer_confirmButton
          )}
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

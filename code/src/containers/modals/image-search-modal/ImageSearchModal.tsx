import { useSearchParams } from "react-router-dom";

import CloseIcon from "@mui/icons-material/Close";

import { useModalContext } from "@/context/modal/ModalContext";

import AppBox from "@/components/app-box/AppBox";
import AppTypography from "@/components/app-typography/AppTypography";
import AppIconButton from "@/components/app-icon-button/AppIconButton";

import { ImageSearchModalProps } from "@/containers/modals/image-search-modal/ImageSearchModal.types";
import ImageSearch from "@/containers/modals/image-search/components/image-search/ImageSearch";

import * as styles from "@/containers/modals/image-search-modal/ImageSearchModal.module.scss";

const ImageSearchModal = ({ onSelect }: ImageSearchModalProps) => {
  const { closeModal } = useModalContext();
  const [searchParams, setSearchParams] = useSearchParams({ search: "" });

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set("search", value);
    else params.delete("search");
    setSearchParams(params);
  };

  const handleSelect = (url: string) => {
    onSelect(url);
    closeModal();
  };

  return (
    <AppBox className={styles.imageSearchModal}>
      <AppIconButton
        className={styles.imageSearchModal_closeIcon}
        onClick={closeModal}
      >
        <CloseIcon />
      </AppIconButton>
      <AppTypography
        variant="h3"
        translationKey="searchImageModal.title"
        className={styles.imageSearchModal_title}
      />
      <ImageSearch
        onSearch={handleSearchChange}
        onSelect={handleSelect}
      />
    </AppBox>
  );
};

export default ImageSearchModal;

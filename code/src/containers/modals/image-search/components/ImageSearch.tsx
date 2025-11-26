import { ChangeEvent, useState } from "react";

import AppContainer from "@/components/app-container/AppContainer";
import AppTypography from "@/components/app-typography/AppTypography";
import AppButton from "@/components/app-button/AppButton";
import AppSearchInput from "@/components/app-search-input/AppSearchInput";

import { useGetManagerImageSearchQuery } from "@/store/tanstack-api/modules/products/queries";

import * as styles from "@/containers/modals/image-search/ImageSearchModal.module.scss";

type ImageSearchProps = {
    onSelect?: (image: string) => void;
    onSearch: (searchValue: string) => void;
}

const ImageSearch = ({ onSelect, onSearch, }: ImageSearchProps) => {
    const [searchValue, setSearchValue] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const { data: images, isLoading, error } = useGetManagerImageSearchQuery({
        searchQuery: searchValue,
    });

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
    };

    const handleClearSearch = () => {
        setSearchValue("");
        onSearch("");
    };

    const handleSearch = () => {
        onSearch(searchValue);
    };

    const handleConfirm = () => {
        if (selectedImage) {
            if (onSelect) onSelect(selectedImage);
            setSelectedImage(null);
            setSearchValue("");
        }
    };

    const renderError = () => {
        if (error) return <AppTypography color="error">Error fetching images</AppTypography>;
        if (!searchValue) return <AppTypography color="textSecondary">Type a keyword to search</AppTypography>;
        if (searchValue.length < 3) return <AppTypography color="textSecondary">Enter at least 3 characters</AppTypography>;
        if (images?.length === 0) return <AppTypography color="textSecondary">No images found</AppTypography>;
        return null;
    };

    return (
        <AppContainer className={styles.searchContainer}>
            <AppSearchInput
                value={searchValue}
                placeholder="Search images..."
                onChange={handleSearchChange}
                onClear={handleClearSearch}
                onSearch={handleSearch}
                disabled={isLoading}
            />

            {isLoading && <AppTypography>Loading...</AppTypography>}
            {renderError()}

            {images && images.length > 0 && (
                <div className={styles.imageGrid}>
                    {images.slice(0, 8).map((url) => (
                        <div
                            key={url}
                            className={`${styles.imageWrapper} ${selectedImage === url ? styles.selected : ""}`}
                            onClick={() => setSelectedImage(url)}
                        >
                            <img src={url} alt="product" className={styles.image} />
                        </div>
                    ))}
                </div>
            )}

            <AppButton
                onClick={handleConfirm}
                disabled={!selectedImage}
                className={selectedImage ? styles.confirmButtonActive : styles.confirmButton}
            >
                Confirm
            </AppButton>
        </AppContainer>
    );
};

export default ImageSearch;

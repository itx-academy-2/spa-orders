import { useState, ChangeEvent } from "react";
import { useIntl } from "react-intl";

import { useSelectedImage } from "@/containers/modals/image-search-modal/hooks/useSelectedImage";

import { useGetManagerImageSearchQuery } from "@/store/tanstack-api/modules/products/queries";
import getImageSearchStatus from "@/utils/get-image-seach-status/getImageSearchStatus";

export const useImageSearch = (onSearch?: (value: string) => void) => {
    const [searchValue, setSearchValue] = useState("");

    const intl = useIntl();

    const { selectedImage, toggleSelection, resetSelection, setSelectedImage } = useSelectedImage();

    const searchQuery = searchValue.length >= 3 ? searchValue : "";
    const { data: images, isLoading, error } = useGetManagerImageSearchQuery({ searchQuery });

    const resetSearch = () => {
        setSearchValue("");
        resetSelection();
        onSearch?.("");
    };

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    };

    const handleClearSearch = () => resetSearch();

    const handleSearch = (value?: string) => {
        const searchTerm = value ?? searchValue;
        onSearch?.(searchTerm);
    };

    const message = getImageSearchStatus({
        error,
        searchValue,
        imagesLength: images?.length ?? 0,
    }, intl);

    return {
        searchValue,
        setSearchValue,
        selectedImage,
        images,
        isLoading,
        message,
        handleSearchChange,
        handleClearSearch,
        handleSearch,
        setSelectedImage,
        toggleSelection,
        resetSearch,
    };
};

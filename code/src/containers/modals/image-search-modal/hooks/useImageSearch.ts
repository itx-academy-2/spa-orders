import { useState, ChangeEvent, useCallback } from "react";
import { useIntl } from "react-intl";

import { useGetManagerImageSearchQuery } from "@/store/tanstack-api/modules/products/queries";
import getImageSearchStatus from "@/utils/get-image-seach-status/getImageSearchStatus";

export const useImageSearch = (onSearch?: (value: string) => void) => {
    const [searchValue, setSearchValue] = useState("");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const intl = useIntl();

    const searchQuery = searchValue.length >= 3 ? searchValue : "";
    const { data: images, isLoading, error } = useGetManagerImageSearchQuery({ searchQuery });

    const resetSearch = useCallback(() => {
        setSearchValue("");
        setSelectedImage(null);
        onSearch?.("");
    }, [onSearch]);

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value);
    const handleClearSearch = () => resetSearch();
    const handleSearch = () => onSearch?.(searchValue);

    const toggleSelection = (current: string | null, value: string) =>
        current === value ? null : value;

    const message = getImageSearchStatus({ error, searchValue, imagesLength: images?.length ?? 0 }, intl);

    return {
        searchValue,
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

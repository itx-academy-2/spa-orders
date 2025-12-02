import { useState } from "react";

export const useSelectedImage = () => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const toggleSelection =
        (value: string) => {
            setSelectedImage((current) => (current === value ? null : value));
        };

    const resetSelection = () => setSelectedImage(null);

    return {
        selectedImage,
        toggleSelection,
        resetSelection,
        setSelectedImage
    };
};

export type ImageGridProps = {
    images: string[];
    selectedImage: string | null;
    onSelect: (url: string) => void;
};

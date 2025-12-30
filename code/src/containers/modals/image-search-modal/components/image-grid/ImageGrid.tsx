import AppBox from "@/components/app-box/AppBox";
import { ImageGridProps } from "@/containers/modals/image-search-modal/components/image-grid/ImageGrid.types";

import cn from "@/utils/cn/cn";

import * as styles from "@/containers/modals/image-search-modal/components/image-grid/ImageGrid.module.scss";

const ImageGrid = ({ images, selectedImage, onSelect }: ImageGridProps) => {
  return (
    <AppBox className={styles.imageGrid} data-cy="image-search-results">
      {images.map((url) => (
        <AppBox
          key={url}
          className={cn(
            styles.imageGrid_imageWrapper,
            selectedImage === url && styles.imageGrid_selectedImage
          )}
          data-cy={selectedImage === url ? "selected-image" : null}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(url);
          }}
        >
          <img src={url} className={styles.imageGrid_image} />
        </AppBox>
      ))}
    </AppBox>
  );
};
export default ImageGrid;
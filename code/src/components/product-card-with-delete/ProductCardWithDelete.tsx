import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import AppBox from "@/components/app-box/AppBox";
import AppIconButton from "@/components/app-icon-button/AppIconButton";
import { ProductCardWithDeleteProps } from "@/components/product-card-with-delete/ProductCardWithDelete.types";

import { useDeleteViewProductMutation } from "@/store/api/viewHistoryApi";

import * as styles from "@/components/product-card-with-delete/ProductCardWithDelete.module.scss";

const ProductCardWithDelete = ({
  productId,
  children
}: ProductCardWithDeleteProps) => {
  const [deleteViewProduct] = useDeleteViewProductMutation();
  return (
    <AppBox className={styles.cardWithDelete}>
      <AppIconButton
        size="medium"
        className={styles.cardWithDelete__deleteButton}
        onClick={() => deleteViewProduct(productId)}
        aria-label="Delete product from view history"
        title="Delete product from view history"
      >
        <DeleteOutlineOutlinedIcon fontSize="small" />
      </AppIconButton>
      {children}
    </AppBox>
  );
};

export default ProductCardWithDelete;

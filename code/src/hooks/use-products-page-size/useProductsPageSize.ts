import useScreenSize from "@/utils/check-screen-size/useScreenSize";
import setProductsPerPageSize from "@/utils/set-product-size/setProductsPerPageSize";

const useProductsPageSize = (category?: string | null) => {
  const screenSize = useScreenSize();

  if (category === "sales") return 4;

  const size = setProductsPerPageSize(screenSize.width);

  return size;
};

export default useProductsPageSize;

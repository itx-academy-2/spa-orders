import { UseUpdateProductOptions } from "@/containers/forms/product-form/hooks/use-update-product/useUpdateProduct.types";

import useSnackbar from "@/hooks/use-snackbar/useSnackbar";
import { useUpdateProductMutation } from "@/store/api/productsApi";
import { UpdateProductBody } from "@/types/product.types";
import isErrorWithStatus from "@/utils/is-error-with-status/isErrorWithStatus";

const useUpdateProduct = (options?: UseUpdateProductOptions) => {
  const [updateProduct, requestState] = useUpdateProductMutation();

  const { openSnackbarWithTimeout } = useSnackbar();

  const onSubmit = async (body: UpdateProductBody) => {
    try {
      await updateProduct(body).unwrap();

      openSnackbarWithTimeout({
        variant: "success",
        messageTranslationKey: "productForm.updation.success"
      });

      if (options?.onSuccess) options.onSuccess();
    } catch (e: unknown) {
      if (isErrorWithStatus(e) && e.status === 409) {
        openSnackbarWithTimeout({
          variant: "error",
          messageTranslationKey: "productForm.concurrency.error"
        });

        if (options?.onError) options.onError();

        return;
      }

      openSnackbarWithTimeout({
        variant: "error",
        messageTranslationKey: "productForm.updation.fail"
      });

      if (options?.onError) options.onError();
    }
  };

  return [onSubmit, requestState] as const;
};

export default useUpdateProduct;

import { useSearchParams } from "react-router-dom";

import SentimentDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentDissatisfiedOutlined";

import ConfirmModal from "@/containers/modals/confirm-modal/ConfirmModal";
import PaginationBlock from "@/containers/pagination-block/PaginationBlock";
import ProductsContainer from "@/containers/products-container/ProductsContainer";
import {
  sortOptions,
  userViewHistoryPageNotFoundErrorConfig
} from "@/containers/user-account/view-history/UserViewHistory.constants";

import AppBox from "@/components/app-box/AppBox";
import AppButton from "@/components/app-button/AppButton";
import AppDropdown from "@/components/app-dropdown/AppDropdown";
import AppTypography from "@/components/app-typography/AppTypography";
import ProductSkeleton from "@/components/product-skeleton/ProductSkeleton";

import { useLocaleContext } from "@/context/i18n/I18nProvider";
import { useModalContext } from "@/context/modal/ModalContext";
import useErrorPageRedirect from "@/hooks/use-error-page-redirect/useErrorPageRedirect";
import usePagination from "@/hooks/use-pagination/usePagination";
import {
  useDeleteAllViewProductsMutation,
  useGetViewHistoryApiQuery
} from "@/store/api/viewHistoryApi";
import { useGetUserWishlistQuery } from "@/store/api/wishlistApi";
import isErrorWithStatus from "@/utils/is-error-with-status/isErrorWithStatus";
import repeatComponent from "@/utils/repeat-component/repeatComponent";

import * as styles from "@/containers/user-account/view-history/UserViewHistory.module.scss";

const UserViewHistory = () => {
  const { page } = usePagination();
  const { locale } = useLocaleContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const sortOption = searchParams.get("sort");
  const { renderRedirectComponent } = useErrorPageRedirect();
  const { openModal, closeModal } = useModalContext();

  const [deleteAllViewProducts] = useDeleteAllViewProductsMutation();
  const {
    data: viewHistoryResponse,
    isLoading,
    isError,
    error
  } = useGetViewHistoryApiQuery({
    page: page - 1,
    size: 6,
    sort: sortOption ?? undefined,
    lang: locale
  });

  const { data: wishlistData } = useGetUserWishlistQuery();
  const wishlist = wishlistData?.content ?? [];

  const pagesCount = viewHistoryResponse?.totalPages ?? 1;

  const onDeleteAll = () => {
    openModal(
      <ConfirmModal
        title="userViewHistory.confirmModal.title"
        description="userViewHistory.confirmModal.description"
        onCancel={closeModal}
        onSave={deleteAllViewProducts}
        textSave="userViewHistory.confirmModal.clearButton"
      />
    );
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);

    if (value) {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }

    setSearchParams(params);
  };

  const defaultDropdownText = sortOptions.find(
    (item) => item.value === sortOption
  )?.label || <AppTypography translationKey="sortOptions.newest" />;

  const content = () => {
    if (isLoading) {
      return (
        <AppBox className={styles.viewHistory_loading}>
          {repeatComponent(<ProductSkeleton />, 10)}
        </AppBox>
      );
    }

    if (isError && isErrorWithStatus(error) && error.status === 404) {
      return renderRedirectComponent(userViewHistoryPageNotFoundErrorConfig);
    }

    if (viewHistoryResponse?.content.length === 0 && !isLoading) {
      return (
        <AppBox
          className={styles.viewHistory_fallback}
          data-cy="view-history-fallback"
        >
          <SentimentDissatisfiedOutlinedIcon fontSize="large" />
          <AppTypography
            variant="h3"
            translationKey="userViewHistory.noProducts"
          />
        </AppBox>
      );
    }

    return (
      <AppBox className={styles.viewHistory_products_container}>
        <ProductsContainer
          products={viewHistoryResponse!.content}
          isViewHistory
          wishlist={wishlist}
          className={styles.viewHistory_products}
        />
      </AppBox>
    );
  };

  return (
    <AppBox className={styles.viewHistory}>
      <AppBox className={styles.viewHistory_header}>
        <AppTypography
          variant="h3"
          translationKey="userViewHistory.title"
          data-cy="view-history-title"
        />
        <AppButton
          className={styles.viewHistory_header__btn}
          variant="contained"
          size="medium"
          onClick={onDeleteAll}
          data-cy="delete-all-products"
        >
          <AppTypography translationKey="userViewHistory.clearAll" />
        </AppButton>
        <AppTypography component="span">
          <AppTypography
            data-cy="products-count"
            translationKey="userViewHistory.productsLabel"
            component="span"
            translationProps={{
              values: { count: viewHistoryResponse?.totalElements || 0 }
            }}
          />
        </AppTypography>
        <AppDropdown
          key={sortOption}
          options={sortOptions}
          onSelect={handleSortChange}
          defaultLabel={defaultDropdownText}
          className={styles.viewHistory_header__sort}
          data-cy="products-dropdown"
          data-testid="products-dropdown"
        />
      </AppBox>
      {content()}
      <PaginationBlock page={page} totalPages={pagesCount} />
    </AppBox>
  );
};

export default UserViewHistory;

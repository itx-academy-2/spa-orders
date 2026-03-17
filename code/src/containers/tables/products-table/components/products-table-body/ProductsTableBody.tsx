import EditIcon from "@mui/icons-material/Edit";

import { ProductsTableBodyProps } from "@/containers/tables/products-table/ProductsTable.types";

import AppBox from "@/components/app-box/AppBox";
import AppIconButton from "@/components/app-icon-button/AppIconButton";
import AppLink from "@/components/app-link/AppLink";
import { AppTableCell } from "@/components/app-table/components";
import AppTypography from "@/components/app-typography/AppTypography";
import AppTooltip from "@/components/app-tooltip/AppTooltip";
import DraftLabel from "@/components/draft-label/DraftLabel";

import routes from "@/constants/routes";
import cn from "@/utils/cn/cn";
import formatDate from "@/utils/format-date/formatDate";
import formatPrice from "@/utils/format-price/formatPrice";
import getCategoryFromTags from "@/utils/get-category-from-tags/getCategoryFromTags";
import truncateWithEllipsis from "@/utils/truncate-with-ellipsis/truncateWithEllipsis";

import "@/containers/tables/products-table/components/products-table-body/ProductsTableBody.scss";

const ProductsTableBody = ({ product }: ProductsTableBodyProps) => {
  const {
    name,
    imageLink,
    price,
    quantity,
    reservedQuantity,
    status,
    tags,
    createdAt,
    id,
    priceWithDiscount,
    discount
  } = product;

  const totalQuantity = quantity + reservedQuantity;

  const categoryName = getCategoryFromTags(tags);

  const category = categoryName ? (
    <AppTypography
      translationKey={`productsAll.${categoryName}`}
      variant="caption"
    />
  ) : (
    <AppTypography variant="caption">-</AppTypography>
  );

  const nameElement = (
    <AppBox className="products-table__body-name-wrapper">
      <AppTypography
        className="products-table__body-name"
        variant="caption"
        data-cy="products-table-item"
      >
        <AppLink to={routes.dashboard.products.productDetails.path(id)}>
          {truncateWithEllipsis(name)}
        </AppLink>
      </AppTypography>
      {status === "HIDDEN" && <DraftLabel />}
    </AppBox>
  );

  return (
    <>
      <AppTableCell>
        <AppBox
          component="img"
          src={imageLink}
          className="products-table__body-image"
        />
      </AppTableCell>
      <AppTableCell>{nameElement}</AppTableCell>
      <AppTableCell>{category}</AppTableCell>
      <AppTableCell>
        <AppTooltip
          titleTranslationKey="productsTable.totalQuantity"
          titleTranslationProps={{ values: { total: totalQuantity } }}
        >
          <AppTypography
            variant="caption"
            component="span"
          >
            {quantity}
          </AppTypography>
        </AppTooltip>
      </AppTableCell>
      <AppTableCell>
        <AppLink to={routes.dashboard.products.reservationsDetails.path(id)}>
          <AppTypography
            variant="caption"
            component="span"
          >
            {reservedQuantity}
          </AppTypography>
        </AppLink>
      </AppTableCell>
      <AppTableCell>{formatPrice(price)}</AppTableCell>
      <AppTableCell
        className={cn(priceWithDiscount && "products-table__discounted-price")}
      >
        {priceWithDiscount ? formatPrice(priceWithDiscount) : "-"}
      </AppTableCell>
      <AppTableCell
        className={cn(priceWithDiscount && "products-table__discounted-price")}
      >
        {priceWithDiscount ? discount + "%" : "-"}
      </AppTableCell>
      <AppTableCell>{formatDate(createdAt)}</AppTableCell>
      <AppTableCell>
        <AppIconButton
          data-cy="products-table-item-update-icon"
          to={routes.dashboard.products.update.path(id)}
          component={AppLink}
        >
          <EditIcon />
        </AppIconButton>
      </AppTableCell>
    </>
  );
};

export default ProductsTableBody;

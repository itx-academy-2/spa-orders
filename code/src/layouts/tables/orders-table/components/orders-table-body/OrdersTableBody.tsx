import DoneIcon from "@mui/icons-material/Done";

import { orderBadgeVariants } from "@/layouts/order-item/OrderItem.constants";

import AppBadge from "@/components/app-badge/AppBadge";
import { AppTableCell } from "@/components/app-table/components";
import AppTypography from "@/components/app-typography/AppTypography";

import { orderStatusesTranslationKeys } from "@/constants/orderStatuses";
import { Order } from "@/types/order.types";
import formatDate from "@/utils/format-date/formatDate";
import formatPrice from "@/utils/format-price/formatPrice";

import "@/layouts/tables/orders-table/components/orders-table-body/OrdersTableBody.scss";

type OrderTableBodyProps = {
  order: Order;
};

const OrdersTableBody = ({ order }: OrderTableBodyProps) => {
  const {
    id,
    createdAt,
    orderItems,
    orderStatus,
    receiver: { firstName, lastName },
    postAddress: { deliveryMethod },
    isPaid
  } = order;

  const orderItemStatus = orderStatusesTranslationKeys[orderStatus];
  const orderReceiver = `${firstName} ${lastName}`;

  const ordersTotalPrice = orderItems.reduce(
    (total, item) => total + item.quantity * item.product.price,
    0
  );

  const orderBadgeItemStatus = (
    <AppTypography
      className="spa-order-table__body-status"
      variant="caption"
      translationKey={orderItemStatus}
    />
  );

  return (
    <>
      <AppTableCell>{id}</AppTableCell>
      <AppTableCell>
        <AppBadge
          variant={orderBadgeVariants[orderItemStatus]}
          badgeContent={orderBadgeItemStatus}
        />
      </AppTableCell>
      <AppTableCell>{formatDate(createdAt)}</AppTableCell>
      <AppTableCell>{orderReceiver}</AppTableCell>
      <AppTableCell>{deliveryMethod}</AppTableCell>
      <AppTableCell>{formatPrice(ordersTotalPrice)}</AppTableCell>
      <AppTableCell>{isPaid && <DoneIcon color="success" />}</AppTableCell>
    </>
  );
};

export default OrdersTableBody;

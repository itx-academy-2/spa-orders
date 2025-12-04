import AppTable from "@/components/app-table/AppTable";
import AppTypography from "@/components/app-typography/AppTypography";

import ReservationsTableHead from "@/containers/tables/reservations-table/components/reservations-table-head/ReservationsTableHead";
import ReservationsTableBody from "@/containers/tables/reservations-table/components/reservations-table-body/ReservationsTableBody";

import { tableColumns } from "@/containers/tables/reservations-table/ReservationsTable.constants";
import { useGetManagerProductReservationsQuery } from "@/store/tanstack-api/modules/products/queries";
import setProductsPerPageSize from "@/utils/set-product-size/setProductsPerPageSize";
import useScreenSize from "@/utils/check-screen-size/useScreenSize";
import usePagination from "@/hooks/use-pagination/usePagination";

import "@/containers/tables/reservations-table/ReservationsTable.scss"

type ReservationsTableProps = {
  productId: string;
};

const ReservationsTable = ({ productId }: ReservationsTableProps) => {
  const { page } = usePagination();
  const screenSize = useScreenSize();
  const size = Math.min(setProductsPerPageSize(screenSize.width), 3);

  const { data } = useGetManagerProductReservationsQuery({
    productId,
    page: page - 1,
    size,
  });

  const ReservationsTableFallback = (
    <AppTypography
      textAlign="center"
      variant="subtitle1"
      translationKey="reservationsTable.fallback"
    />
  );

  return (
    <AppTable
      classNames={{
        container: "reservations-table",
        body: "reservations-table__body",
        fallback: "reservations-table__fallback",
      }}
      headItems={tableColumns}
      renderHeadItem={(head) => <ReservationsTableHead key={head} head={head} />}
      bodyItems={data?.content ?? []}
      renderBodyItem={(item) => <ReservationsTableBody key={item.email} reservation={item} />}
      fallback={ReservationsTableFallback}
    />
  );
};

export default ReservationsTable;

import AppTable from "@/components/app-table/AppTable";
import AppTypography from "@/components/app-typography/AppTypography";

import ReservationsTableHead from "@/containers/tables/reservations-table/components/reservations-table-head/ReservationsTableHead";
import ReservationsTableBody from "@/containers/tables/reservations-table/components/reservations-table-body/ReservationsTableBody";

import { tableColumns } from "@/containers/tables/reservations-table/ReservationsTable.constants";
import { ReservationsTableProps } from "@/containers/tables/reservations-table/ReservationsTable.types";

import "@/containers/tables/reservations-table/ReservationsTable.scss"

const ReservationsTable = ({ reservations }: ReservationsTableProps) => {
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
      bodyItems={reservations ?? []}
      renderBodyItem={(item) => <ReservationsTableBody key={item.email} reservation={item} />}
      fallback={ReservationsTableFallback}
    />
  );
};

export default ReservationsTable;

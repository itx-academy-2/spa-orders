export const reservationsKeys = {
  all: ["reservations"] as const,

  myReservations: () =>
    [...reservationsKeys.all, "myReservations"] as const,
  myReservationsMetadata: () =>
    [...reservationsKeys.all, "metadata"] as const,
};

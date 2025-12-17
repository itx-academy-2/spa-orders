export const reservationsKeys = {
  all: ["reservations"] as const,

  myReservations: () =>
    [...reservationsKeys.all, "myReservations"] as const,
};

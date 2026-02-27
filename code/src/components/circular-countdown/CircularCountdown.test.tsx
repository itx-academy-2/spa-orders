import { render, screen } from "@testing-library/react";

import CircularCountdown from "@/components/circular-countdown/CircularCountdown";

jest.mock("@/containers/tables/reservations-table/hooks/useTimeLeft", () => ({
  useTimeLeft: () => ({ hours: 10, minutes: 0, seconds: 0, expired: false }),
}));

describe("CircularCountdown", () => {
  it("renders CircularCountdown", () => {
    render(<CircularCountdown reservedAt="2026-02-26T13:41:11.441573" size={100} />);

    expect(screen.getByTestId("circular-countdown")).toBeInTheDocument();
  });
});
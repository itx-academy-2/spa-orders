import { render, screen } from "@testing-library/react";
import CircularCountdown from "./CircularCountdown";
import * as hooks from "@/containers/tables/reservations-table/hooks/useTimeLeft";
import { Duration } from "luxon";

describe("CircularCountdown", () => {
  const reservedAt = "2026-03-11T12:00:00.000Z";

  beforeEach(() => {
    jest.restoreAllMocks();
  });

  test("renders without crashing", () => {
    jest.spyOn(hooks, "useTimeLeft").mockReturnValue(
      Duration.fromObject({ hours: 1, minutes: 2, seconds: 3 })
    );

    render(<CircularCountdown reservedAt={reservedAt} size={100} />);
    expect(screen.getByTestId("circular-countdown")).toBeInTheDocument();
  });

  test("displays correct hours, minutes, and seconds", () => {
    jest.spyOn(hooks, "useTimeLeft").mockReturnValue(
      Duration.fromObject({ hours: 1, minutes: 2, seconds: 3 })
    );

    render(<CircularCountdown reservedAt={reservedAt} size={100} />);
    expect(screen.getByText("01 :02")).toBeInTheDocument();
    expect(screen.getByText(": 03")).toBeInTheDocument();
  });

  test("updates percent correctly from getCountdownPercent", () => {
    const mockPercent = 75;
    jest.spyOn(hooks, "useTimeLeft").mockReturnValue(
      Duration.fromObject({ hours: 1, minutes: 0, seconds: 0 })
    );

    jest.mock("@/utils/get-countdown-percent/getCountdownPercent", () => ({
      getCountdownPercent: jest.fn(() => ({ percent: mockPercent, totalSeconds: 3600 }))
    }));

    render(<CircularCountdown reservedAt={reservedAt} size={100} />);
    const progress = screen.getByRole("progressbar") as HTMLDivElement;
    expect(progress).toBeInTheDocument();
  });
});
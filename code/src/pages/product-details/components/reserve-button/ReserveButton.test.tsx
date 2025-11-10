import { render, screen } from "@testing-library/react";
import ReserveButton from "./ReserveButton";

describe("ReserveButton", () => {
  test("renders a button", () => {
    render(<ReserveButton />);
    
    const reserveButton = screen.getByRole("button");   
    expect(reserveButton).toBeInTheDocument();
  });
});

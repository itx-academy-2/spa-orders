import { render, screen } from "@testing-library/react";

import EmailAndPassword from "@/components/profile-email-password/EmailAndPassword";

import renderWithProviders from "@/utils/render-with-providers/renderWithProviders";

const mockedEmail = "email@mail.com";

describe("EmailAndPassword", () => {
  beforeEach(() => {
    renderWithProviders(<EmailAndPassword email={mockedEmail} />);
  });

  it("should render EmailAndPassword section", () => {
    const title = screen.getByText("emailAndPassword.title");
    const input = screen.getByLabelText(
      "emailAndPassword.inputLabel"
    ) as HTMLInputElement;
    const button = screen.getByText("emailAndPassword.buttonLabel");

    expect(title).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(input.value).toBe(mockedEmail);
  });
});

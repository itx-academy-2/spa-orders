import { render } from "@testing-library/react";
import React from "react";
import { FieldError } from "react-hook-form";
import { IntlProvider } from "react-intl";

import getErrorMessage from "./getErrorMessage";

type TestComponentProps = {
  error: FieldError | undefined;
};

const TestComponent = ({ error }: TestComponentProps) => {
  const errorMessage = getErrorMessage(error);
  return <div>{errorMessage}</div>;
};

const mockMessage = {
  "error.required": "This field is required."
};

const renderWithIntl = (component: React.ReactNode) => {
  return render(
    <IntlProvider locale="en" messages={mockMessage}>
      {component}
    </IntlProvider>
  );
};

describe("getErrorMessage", () => {
  it("should return the formatted message when a valid error with a message ID exists", () => {
    const error: FieldError = {
      type: "required",
      message: "error.required"
    };

    const { getByText } = renderWithIntl(<TestComponent error={error} />);

    expect(getByText("error.required")).toBeInTheDocument();
  });

  it("should return undefined when the error is not a string", () => {
    const error = {
      type: "pattern",
      message: {
        id: "some.id"
      }
    } as unknown as FieldError;

    const { container } = renderWithIntl(<TestComponent error={error} />);

    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it("should return undefined when no error is provided", () => {
    const error = undefined;

    const { container } = renderWithIntl(<TestComponent error={error} />);

    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it("should return undefined when the message ID does not exist in messages", () => {
    const error: FieldError = {
      type: "pattern",
      message: "error.nonExistent"
    };

    const { container } = renderWithIntl(<TestComponent error={error} />);

    expect(container.textContent).toBe("error.nonExistent");
  });
});

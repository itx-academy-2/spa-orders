import { render, screen } from "@testing-library/react";
import { FieldError, FieldErrors, useForm } from "react-hook-form";

import { DeliveryFormData } from "@/containers/forms/delivery-form/DeliveryForm.types";
import DeliveryFormFields from "@/containers/forms/delivery-form/components/delivery-from-fields/DeliveryFormFields";

const createError = (message: string): FieldError => ({
  type: "manual",
  message,
  ref: undefined
});

const mockedValuesErrors = {
  firstName: { message: "error.firstName" },
  lastName: { message: "error.lastName" },
  phone: { message: "error.phone" },
  city: { message: "error.city" },
  department: { message: "error.department" },
  title: { message: "error.title" }
};

const mockedErrors = {
  firstName: createError("error.firstName"),
  lastName: createError("error.lastName"),
  phone: createError("error.phone"),
  city: createError("error.city"),
  department: createError("error.department"),
  title: createError("error.title")
};

function Wrapper({
  checked = false,
  errors = {}
}: {
  checked?: boolean;
  errors?: FieldErrors;
}) {
  const { control } = useForm<DeliveryFormData>({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      city: "",
      department: "",
      deliveryMethod: "NOVA",
      title: ""
    }
  });
  return (
    <DeliveryFormFields
      control={control}
      errors={errors}
      checked={checked}
    />
  );
}

describe("DeliveryFormFields", () => {
  it("renders all input fields except title when checked is false", () => {
    render(<Wrapper />);
    const firstName = screen.getByLabelText(/deliveryForm.firstName/i);
    const lastName = screen.getByLabelText(/deliveryForm.lastName/i);
    const phone = screen.getByLabelText(/deliveryForm.phone/i);
    const city = screen.getByLabelText(/deliveryForm.city/i);
    const department = screen.getByLabelText(/deliveryForm.department/i);
    const deliveryMethod = screen.getByRole("combobox");
    const title = screen.queryByLabelText(/deliveryForm.addressTitle/i);

    expect(firstName).toBeInTheDocument();
    expect(lastName).toBeInTheDocument();
    expect(phone).toBeInTheDocument();
    expect(city).toBeInTheDocument();
    expect(department).toBeInTheDocument();
    expect(deliveryMethod).toBeInTheDocument();
    expect(title).not.toBeInTheDocument();
  });

  it("renders the title input when checked is true", () => {
    render(<Wrapper checked />);
    const title = screen.getByLabelText(/deliveryForm.addressTitle/i);
    expect(title).toBeInTheDocument();
  });

  it("shows error messages if errors are passed", () => {
    render(<Wrapper checked errors={mockedErrors} />);
    const firstNameError = screen.getByText(
      mockedValuesErrors.firstName.message
    );
    const lastNameError = screen.getByText(mockedValuesErrors.lastName.message);
    const phoneError = screen.getByText(mockedValuesErrors.phone.message);
    const cityError = screen.getByText(mockedValuesErrors.city.message);
    const departmentError = screen.getByText(
      mockedValuesErrors.department.message
    );
    const titleError = screen.getByText(mockedValuesErrors.title.message);

    expect(firstNameError).toBeInTheDocument();
    expect(lastNameError).toBeInTheDocument();
    expect(phoneError).toBeInTheDocument();
    expect(cityError).toBeInTheDocument();
    expect(departmentError).toBeInTheDocument();
    expect(titleError).toBeInTheDocument();
  });
});

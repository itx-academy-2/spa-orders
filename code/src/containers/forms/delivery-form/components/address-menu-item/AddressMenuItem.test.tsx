import { render, screen } from "@testing-library/react";

import AddressMenuItem from "@/containers/forms/delivery-form/components/address-menu-item/AddressMenuItem";

const mockAddress = {
  title: "Home",
  firstName: "John",
  lastName: "Doe",
  phone: "+380960000001",
  city: "Lviv",
  deliveryMethod: "NOVA_POSHTA",
  department: "52"
};

describe("AddressMenuItem", () => {
  it("renders all address fields", () => {
    render(<AddressMenuItem address={mockAddress} value={mockAddress.title} />);
    const title = screen.getByText(mockAddress.title);
    const firstName = screen.getByText(mockAddress.firstName);
    const lastName = screen.getByText(mockAddress.lastName);
    const phone = screen.getByText(mockAddress.phone);
    const city = screen.getByText(mockAddress.city);
    const deliveryMethod = screen.getByText(mockAddress.deliveryMethod);
    const department = screen.getByText(mockAddress.department);

    expect(title).toBeInTheDocument();
    expect(firstName).toBeInTheDocument();
    expect(lastName).toBeInTheDocument();
    expect(phone).toBeInTheDocument();
    expect(city).toBeInTheDocument();
    expect(deliveryMethod).toBeInTheDocument();
    expect(department).toBeInTheDocument();
  });
});

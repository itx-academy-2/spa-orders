import { render, screen } from "@testing-library/react";

import AddressCard from "./AddressCard";

const mockedAddress = [
  {
    title: "Home",
    firstName: "John",
    lastName: "Doe",
    phone: "+380960000001",
    city: "Lviv",
    postMethod: "NOVA_POSHTA",
    department: "52"
  }
];

describe("AddressCard", () => {
  it("should render AddressCard correctly", () => {
    render(<AddressCard address={mockedAddress[0]} />);

    const title = screen.getByText(mockedAddress[0].title);
    const fullName = screen.getByText(
      `${mockedAddress[0].firstName} ${mockedAddress[0].lastName}`
    );
    const phone = screen.getByText(mockedAddress[0].phone);
    const location = screen.getByText(
      `${mockedAddress[0].city}, ${mockedAddress[0].postMethod}, ${mockedAddress[0].department}`
    );

    expect(title).toBeInTheDocument();
    expect(fullName).toBeInTheDocument();
    expect(phone).toBeInTheDocument();
    expect(location).toBeInTheDocument();
  });
});

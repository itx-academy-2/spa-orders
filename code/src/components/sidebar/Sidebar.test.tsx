import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Sidebar from "./Sidebar";

describe("Sidebar", () => {
  it("should render SidebarMenu component", () => {
    const { getByRole } = render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(getByRole("button", { name: "label.profile" })).toBeInTheDocument();
  });
});

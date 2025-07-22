import { render, screen } from "@testing-library/react";

import userEvent from "@testing-library/user-event";

import ConfirmModal from "./ConfirmModal";

const mockedCloseModal = jest.fn();
const mockedSaveModal = jest.fn();

const mockedDescription = "some description";
const renderAndMock = (
  description?: string,
  textSave?: string,
  textCancel?: string
) => {
  return render(
    <ConfirmModal
      title="title"
      description={description}
      onCancel={mockedCloseModal}
      onSave={mockedSaveModal}
      textSave={textSave}
      textCancel={textCancel}
    />
  );
};

describe("ConfirmModal", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should render Modal with title and default buttons name", () => {
    renderAndMock();

    const title = screen.getByText("title");
    const saveBtn = screen.getByText("confirmModal.saveButton");
    const closeBtn = screen.getByText("confirmModal.closeButton");

    expect(title).toBeInTheDocument();
    expect(saveBtn).toBeInTheDocument();
    expect(closeBtn).toBeInTheDocument();
  });

  it("should render Modal with description", () => {
    renderAndMock(mockedDescription);

    const description = screen.getByText(mockedDescription);

    expect(description.innerHTML).toBe(mockedDescription);
    expect(description.tagName.toLowerCase()).toBe("p");
  });

  it("should invoke save and close modal", async () => {
    renderAndMock();

    const saveBtn = screen.getByText("confirmModal.saveButton");
    await userEvent.click(saveBtn);

    expect(mockedSaveModal).toHaveBeenCalled();
    expect(mockedCloseModal).toHaveBeenCalled();
  });

  it("should close modal by cancel button", async () => {
    renderAndMock();

    const closeBtn = screen.getByText("confirmModal.closeButton");
    await userEvent.click(closeBtn);

    expect(mockedCloseModal).toHaveBeenCalledTimes(1);
  });
});

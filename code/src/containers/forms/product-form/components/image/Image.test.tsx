import { fireEvent, render, screen } from "@testing-library/react";
import { Controller, ControllerRenderProps } from "react-hook-form";

import {
  ProductFormControl,
  ProductFormFieldErrors,
  ProductFormRegisterFunction
} from "@/containers/forms/product-form/ProductForm.types";
import ImagePreview from "@/containers/forms/product-form/components/image/Image";
import { useModalContext } from "@/context/modal/ModalContext";

import getTagIn from "@/utils/get-tag-in/getTagIn";
import typeIntoInput from "@/utils/type-into-input/typeIntoInput";

type MockControllerProps = {
  render: (props: { field: ControllerRenderProps }) => JSX.Element;
};

jest.mock("react-hook-form", () => ({
  Controller: jest.fn()
}));

jest.mock("@/context/modal/ModalContext", () => ({
  useModalContext: jest.fn()
}));

const mockOpenModal = jest.fn();
const mockCloseModal = jest.fn();
const mockToggleModal = jest.fn();

beforeEach(() => {
  (useModalContext as jest.Mock).mockReturnValue({
    openModal: mockOpenModal,
    closeModal: mockCloseModal,
    toggleModal: mockToggleModal
  });
});

// Mock error for input
const imageError = {
  image: {
    message: "Image error"
  }
} as unknown as ProductFormFieldErrors;

const controllerPropsWithValue = {
  value: "https://test.com/image.jpg",
  onChange: jest.fn()
} as unknown as ControllerRenderProps;

const registerFunction = (() => ({})) as unknown as ProductFormRegisterFunction;
const controlFunction = (() => ({})) as unknown as ProductFormControl;

const renderAndMock = (
  controllerRenderProps: ControllerRenderProps = {} as ControllerRenderProps,
  errors: ProductFormFieldErrors = {}
) => {
  (Controller as jest.Mock).mockImplementation(
    ({ render }: MockControllerProps) =>
      render({ field: controllerRenderProps })
  );

  render(
    <ImagePreview
      register={registerFunction}
      errors={errors}
      control={controlFunction}
    />
  );
};

describe("ImagePreview Component", () => {
  test("renders input and default image preview text", () => {
    renderAndMock();

    const imageInput = screen.getByRole("textbox");
    const imagePreviewText = screen.getByText("productForm.image.preview");

    expect(imageInput).toBeInTheDocument();
    expect(imagePreviewText).toBeInTheDocument();
  });

  test("renders helper text and error styles when error exists", () => {
    renderAndMock(undefined, imageError);

    const imageHelperText = screen.getByText("Image error");
    const imageInput = getTagIn("product-form-image-input");

    expect(imageHelperText).toBeInTheDocument();
    expect(imageInput.closest(".Mui-error")).toBeTruthy();
  });

  test("does not display error styles by default", () => {
    renderAndMock();

    const imageInput = getTagIn("product-form-image-input");

    expect(imageInput.closest(".Mui-error")).toBeFalsy();
  });

  test("shows error when image fails to load and clears on valid input", async () => {
    renderAndMock(controllerPropsWithValue);

    const image = screen.getByTestId("product-form-image-preview");
    fireEvent.error(image);

    const errorText = screen.getByText("productForm.image.previewError");
    expect(errorText).toBeInTheDocument();

    const imageInput = getTagIn("product-form-image-input");
    await typeIntoInput(imageInput, "https://test.com/example.jpg");

    const updatedImage = screen.getByTestId("product-form-image-preview");
    expect(updatedImage).toBeInTheDocument();
  });

  test("displays image when input has value", () => {
    renderAndMock(controllerPropsWithValue);

    const image = screen.getByTestId("product-form-image-preview");
    
    expect(image).toBeInTheDocument();
  });

  test("displays default preview text if input is empty", () => {
    renderAndMock();

    const imageText = screen.getByText("productForm.image.preview");

    expect(imageText).toBeInTheDocument();
  });
});

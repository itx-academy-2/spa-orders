import { act, renderHook } from "@testing-library/react";
import { useForm } from "react-hook-form";

import { DeliveryFormData } from "@/containers/forms/delivery-form/DeliveryForm.types";

import { PostAddressExtended } from "@/types/delivery.types";

import useAddressSync from "./useAddressSync";

const addresses: PostAddressExtended[] = [
  {
    id: "1",
    deliveryMethod: "UKRPOSHTA",
    city: "Lviv",
    department: "52",
    title: "Home",
    firstName: "John",
    lastName: "Doe",
    phone: "+380960775434"
  },
  {
    id: "2",
    deliveryMethod: "NOVA",
    city: "Kyiv",
    department: "23",
    title: "Office",
    firstName: "Anna",
    lastName: "Ivanova",
    phone: "+380931112233"
  }
];
const mockedFakeTitle = "NotExistingTitle";

function getWatchedFields(values: DeliveryFormData) {
  return {
    firstName: values.firstName,
    lastName: values.lastName,
    phone: values.phone,
    city: values.city,
    department: values.department,
    deliveryMethod: values.deliveryMethod,
    title: values.title
  };
}

describe("useAddressSync", () => {
  it("sets form fields when address is selected", async () => {
    const { result } = renderHook(() => {
      const form = useForm<DeliveryFormData>({
        defaultValues: {
          firstName: "",
          lastName: "",
          phone: "",
          city: "",
          department: "",
          deliveryMethod: "UKRPOSHTA",
          title: ""
        }
      });

      useAddressSync({
        addresses,
        selectedDropdown: "Home",
        watchedFields: getWatchedFields(form.getValues()),
        setValue: form.setValue
      });

      return form;
    });

    expect(result.current.getValues("firstName")).toBe("John");
    expect(result.current.getValues("lastName")).toBe("Doe");
    expect(result.current.getValues("phone")).toBe("+380960775434");
    expect(result.current.getValues("city")).toBe("Lviv");
    expect(result.current.getValues("department")).toBe("52");
    expect(result.current.getValues("deliveryMethod")).toBe("UKRPOSHTA");
    expect(result.current.getValues("title")).toBe("Home");
  });

  it("clears title if a field changes and matches selected title", () => {
    const { result, rerender } = renderHook(
      ({ selectedDropdown }) => {
        const form = useForm<DeliveryFormData>({
          defaultValues: {
            firstName: "John",
            lastName: "Doe",
            phone: "+380960775434",
            city: "Lviv",
            department: "52",
            deliveryMethod: "UKRPOSHTA",
            title: "Home"
          }
        });

        useAddressSync({
          addresses,
          selectedDropdown,
          watchedFields: getWatchedFields(form.getValues()),
          setValue: form.setValue
        });

        return form;
      },
      {
        initialProps: { selectedDropdown: "Home" }
      }
    );

    act(() => {
      result.current.setValue("city", "Kyiv");
    });

    rerender({ selectedDropdown: "Home" });
    expect(result.current.getValues("title")).toBe("");
  });

  it("does nothing when selectedDropdown is empty", () => {
    const { result } = renderHook(() =>
      useForm<DeliveryFormData>({
        defaultValues: {
          firstName: "",
          lastName: "",
          phone: "",
          city: "",
          department: "",
          deliveryMethod: "UKRPOSHTA",
          title: ""
        }
      })
    );

    const setValueSpy = jest.spyOn(result.current, "setValue");

    renderHook(() =>
      useAddressSync({
        addresses,
        selectedDropdown: "",
        watchedFields: getWatchedFields(result.current.getValues()),
        setValue: result.current.setValue
      })
    );

    expect(setValueSpy).not.toHaveBeenCalled();
  });

  it("does nothing when selectedDropdown is set but not found in addresses", () => {
    const { result } = renderHook(() =>
      useForm<DeliveryFormData>({
        defaultValues: {
          firstName: "",
          lastName: "",
          phone: "",
          city: "",
          department: "",
          deliveryMethod: "UKRPOSHTA" as const,
          title: ""
        }
      })
    );

    const setValueSpy = jest.spyOn(result.current, "setValue");

    renderHook(() =>
      useAddressSync({
        addresses,
        selectedDropdown: mockedFakeTitle,
        watchedFields: getWatchedFields(result.current.getValues()),
        setValue: result.current.setValue
      })
    );

    expect(setValueSpy).not.toHaveBeenCalled();
  });
});

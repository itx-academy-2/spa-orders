import { render, screen, fireEvent } from "@testing-library/react";

import ImageGrid from "@/containers/modals/image-search-modal/components/image-grid/ImageGrid";

const IMAGES = [
  "https://example.com/1.jpg",
  "https://example.com/2.jpg",
  "https://example.com/3.jpg",
];

test("renders all images passed via props", () => {
  const onSelect = jest.fn();
  render(<ImageGrid images={IMAGES} selectedImage={null} onSelect={onSelect} />);

  const imgs = screen.getAllByRole("img");
  expect(imgs).toHaveLength(IMAGES.length);
  expect(imgs[0]).toHaveAttribute("src", IMAGES[0]);
  expect(imgs[1]).toHaveAttribute("src", IMAGES[1]);
  expect(imgs[2]).toHaveAttribute("src", IMAGES[2]);
});

test("calls onSelect with clicked image url and stops propagation to parent", () => {
  const onSelect = jest.fn();
  const parentClick = jest.fn();

  render(
    <div data-testid="parent" onClick={parentClick}>
      <ImageGrid images={IMAGES} selectedImage={null} onSelect={onSelect} />
    </div>
  );

  const imgs = screen.getAllByRole("img");
  fireEvent.click(imgs[0]);

  expect(onSelect).toHaveBeenCalledTimes(1);
  expect(onSelect).toHaveBeenCalledWith(IMAGES[0]);
  expect(parentClick).not.toHaveBeenCalled();
});

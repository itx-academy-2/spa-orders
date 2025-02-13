import { ProductTranslation } from "@/containers/forms/product-form/ProductForm.types";

import { Lang, Pageable, PageableResponse } from "@/types/common";

export type ProductStatus = "AVAILABLE";

export type Product = {
  id: string;
  name: string;
  description: string;
  status: ProductStatus;
  tags: string[];
  image: string;
  price: number;
  discount?: number;
  priceWithDiscount?: number | null;
};

export type ManagerProductStatus = "VISIBLE" | "HIDDEN";

export type ManagerProduct = {
  id: string;
  name: string;
  description: string;
  imageLink: string;
  quantity: number;
  price: number;
  createdAt: string;
  status: ManagerProductStatus;
  tags: string[];
  discount: number | null;
  priceWithDiscount: number | null;
};

export type ProductFromSearch = Pick<Product, "id" | "image" | "name">;

export type GetUserProductsResponse = {
  content: Product[];
  totalPages: number;
  totalElements: number;
};

export type GetUserProductsParams = Lang & {
  tags?: string;
  page?: number;
  size?: number;
  sort?: string;
  discount?: number;
};

export type GetUserProductByIdResponse = Pick<
  Product,
  | "image"
  | "price"
  | "tags"
  | "name"
  | "description"
  | "discount"
  | "priceWithDiscount"
> & {
  quantity: number;
};

export type GetUserProductByIdParams = Lang & {
  productId: string;
};

export type GetManagerProductsResponse = PageableResponse<ManagerProduct[]>;

export type GetManagerProductsParams = Partial<Pageable & Lang> & {
  searchByName?: string;
};

export type GetUserProductsBySearchQueryParams = Lang & {
  page?: number;
  size?: number;
  sort?: string;
  searchQuery: string;
};

export type GetUserProductsBySearchQueryResponse = PageableResponse<
  ProductFromSearch[]
>;

export type ProductBody = {
  status: ManagerProductStatus;
  tagIds: number[];
  image: string;
  price: number;
  quantity: number;
  productTranslations: ProductTranslation[];
};

export type UpdateProductBody = Partial<ProductBody> & {
  productId: string;
};

export type CreateProductBody = ProductBody;

export type ManagerProductTag = {
  id: number;
  name: string;
};

export type GetManagerProductByIdResponse = {
  id: string;
  status: ManagerProductStatus;
  image: string;
  createdAt: string;
  quantity: number;
  price: number;
  discount: number | null;
  priceWithDiscount: number | null;
  tags: ManagerProductTag[];
  productTranslations: ProductTranslation[];
};

export type FullManagerProduct = Omit<
  ManagerProduct,
  "tags" | "name" | "description" | "imageLink"
> & {
  tags: ManagerProductTag[];
  productTranslations: ProductTranslation[];
  image: string;
};

export type GetManagerProductByIdParams = {
  productId: string;
};

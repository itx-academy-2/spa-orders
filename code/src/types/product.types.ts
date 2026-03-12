import { ProductTranslation } from "@/containers/forms/product-form/ProductForm.types";

import { Lang, Pageable, PageableResponse } from "@/types/common";

export type ProductStatus = "AVAILABLE" | "END_SOON" | "ENDED";

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
  percentageOfTotalOrders?: number | null;
};

export type ManagerProductStatus = "VISIBLE" | "HIDDEN";

export type ManagerProduct = {
  id: string;
  name: string;
  displayName?: string;
  description: string;
  imageLink: string;
  quantity: number;
  price: number;
  createdAt: string;
  status: ManagerProductStatus;
  percentageOfTotalOrders: number | null;
  tags: string[];
  discount: number | null;
  priceWithDiscount: number | null;
};

export type ProductFromSearch = Pick<Product, "id" | "image" | "name" | "status">;

export type GetUserProductsResponse = {
  minProductPrice: number;
  maxProductPrice: number;
  totalElements: number;
  totalPages: number;
  size: number;
  content: Product[];
};

export type ProductFilterParams = {
  tags: string[];
  discount: boolean;
  nonDiscount: boolean;
  priceMin?: number;
  priceMax?: number;
  availability: boolean;
  nonAvailability: boolean;
  deliveryNovaPost: boolean;
  deliveryUkrPost: boolean;
};

export type GetUserProductsParams = Lang & ProductFilterParams & Omit<Pageable, "sort"> & {
  sort: string;
  tags: string[];
};

export type GetSaleProductsResponse = {
  maximumPriceWithDiscount: number;
  minimumPriceWithDiscount: number;
  maximumDiscount: number;
  minimumDiscount: number;
  pageProducts: GetUserProductsResponse;
};

export type GetSaleProductsParams = Lang & {
  minimumDiscount?: number;
  maximumDiscount?: number;
  minimumPriceWithDiscount?: number;
  maximumPriceWithDiscount?: number;
  tags?: string[];
  page?: number;
  size?: number;
  sort?: string;
};

export type GetUserProductByIdResponse = Pick<
  Product,
  | "status"
  | "id"
  | "image"
  | "price"
  | "tags"
  | "name"
  | "description"
  | "discount"
  | "priceWithDiscount"
  | "percentageOfTotalOrders"
> & {
  quantity: number;
};

export type GetSuggestedProductResponse = GetUserProductByIdResponse;

export type GetSuggestedProductParams = {
  tag: string;
  lang: string;
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
  discount: number;
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
  percentageOfTotalOrders: number | null;
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
  discount: number | null;
};

export type GetManagerProductByIdParams = {
  productId: string;
};

export type GetManagerImageSearchParams = {
  searchQuery: string;
}

export type ImageUrl = string;
export type GetManagerImageSearchResponse = ImageUrl[];

export type ProductReservationDetails = {
  username: string;
  email: string;
  quantity: number;
  addedAt: string;
}

export type GetManagerReservedByIdParams = Omit<Pageable, "sort"> & {
  productId: string;
  sort?: string;
};

export type GetManagerReservedByIdResponse = {
  content: ProductReservationDetails[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};

export interface BestsellerProduct extends Product {
  percentageOfTotalOrders: number;
}

export interface GetBestsellerProductsResponse {
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  size: number;
  empty: boolean;
  content: BestsellerProduct[];
}

export type GetViewHistoryResponse = {
  content: Product[];
  totalPages: number;
  totalElements: number;
};

export type GetViewHistoryParams = Lang & {
  tags?: string;
  page?: number;
  size?: number;
  sort?: string;
};

export type GetUserWishlistResponse = {
  content: Product[];
  totalPages: number;
  totalElements: number;
};

export type GetUserWishlistParams = Lang & {
  tags?: string;
  page?: number;
  size?: number;
  sort?: string;
};

export type GetBestsellerProductsParams = Lang & {
  tags?: string;
  page?: number;
  size?: number;
  sort?: string;
};

export type ReservationProductParams = {
  productId: string;
};

export type GetMyReservationsParams = Lang & Omit<Pageable, "sort"> & {
  sort?: string;
};

export type GetMyReservationsResponse = Product[];

export type ReservationMetadata = {
  id: string;
  reservedAt: string;
};

export type GetMyReservationsMetadataResponse = {
  remainingMoney: string;
  remainingItems: number;
  reservations: ReservationMetadata[];
};
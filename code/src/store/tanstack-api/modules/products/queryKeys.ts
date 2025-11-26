export const productsKeys = {
    all: ["products"] as const,
    managerImageSearch: (searchQuery: string) => [...productsKeys.all, "imageSearch", searchQuery] as const,
};

import ProductRepository from "@/core/product/Repository";

const repository = new ProductRepository();

export const getStockCount = async (storeId: string) => {
  const salesCount = await repository.fetchCount({
    storeId: storeId,
    isPaid: true,
    isArchived: false,
  });

  return salesCount;
};

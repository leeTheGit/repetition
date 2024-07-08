import AssetRepository from "@/core/asset/AssetRepository";

const Repository = new AssetRepository();

export const getAsset = async (uuid: string, organisationId: string, storeId: string) => {
    const assets = await Repository.fetchByUuid(uuid, {
        organisationId: organisationId,
        // storeId: storeId,
    });

    return assets;
}


export const getAsssetCount = async (organisationId: string, storeId: string) => {

    const assetCount = await Repository.fetchCount({
        organisationId: organisationId,
        storeId: storeId,
    });


  return getAsssetCount;
};
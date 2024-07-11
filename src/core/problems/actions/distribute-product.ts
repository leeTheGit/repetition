import Repository from '@/core/product/Repository'
import CollectionRepository from '@/core/collections/Repository'
import DistributionRepository from '@/core/distribution/Repository'
import { isError } from '@/core/types'
import { logger } from '@/lib/logger'

const repository = new Repository()
// const collectionRepository = new CollectionRepository()
const distributionRepository = new DistributionRepository()

export const distributeProduct = async (
    organisationUuid: string,
    storeId: string,
    productId: string,
    data: any
) => {
    try {
        const collections = data.collectionIds || []
        delete data.collectionIds
        const update = await repository.update(productId, data)
        if (isError(update)) {
            return {
                error: 'Error updating product',
            }
        }

        const collectionMap: { [key: string]: boolean } = {}
        for (let coll in collections) {
            collectionMap[collections[coll]] = true
        }
        const distribution = await distributionRepository.fetchAll({
            storeId: storeId,
            productId: productId,
        })
        if (isError(distribution)) {
            return {
                error: 'Error fetching distribution',
            }
        }

        const distributionRemoveList: string[] = []
        if (distribution.length > 0) {
            for (let dist in distribution) {
                if (collectionMap[distribution[dist].collectionUuid]) {
                    delete collectionMap[distribution[dist].collectionUuid]
                    continue
                }
                distributionRemoveList.push(distribution[dist].uuid)
            }
        }

        const toPublish = []
        for (let coll in collections) {
            toPublish.push({
                storeUuid: storeId,
                productUuid: productId,
                organisationUuid: organisationUuid,
                collectionUuid: collections[coll],
                type: 'product',
                publishAt: new Date(),
            })
        }
        distributionRepository.create(toPublish)

        for (let dist in distribution) {
            if (collectionMap[distribution[dist].collectionUuid]) {
                continue
            }
            await distributionRepository.delete(
                storeId,
                distribution[dist].uuid
            )
        }

        return update
    } catch (error) {
        logger.info('[PRODUCT_PATCH]', error)
        return {
            error: 'Internal error',
        }
    }
}

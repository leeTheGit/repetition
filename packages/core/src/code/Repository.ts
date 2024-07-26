import DynamoComponent from '@repetition/core/lib/aws/DynamoComponent'

import { FetchParams } from '@repetition/core/code/Validators'
import { ModelError, isError } from '@repetition/core/types'

const Dynamo = new DynamoComponent

const DEFAULT_LIMIT = 50
const DEFAULT_OFFSET = 0

class Repository {



    // async fetchAll(params: FetchParams): Promise<ModelEntity[]> {
    //     return 
    // }


    async fetchByUuid(
        identifier: string,
        params: FetchParams = {}
    ) {
        const item = await Dynamo.getItem(identifier)
        return item
    }


    async create(data: any) {
        const saved = Dynamo.putItem(data)
    }


    // mapToEntity(item: TableType) {
        // console.log("logging it", this.EntityMapper)
        // return this.EntityMapper(item)
    //     const itemData = convertCase(item)
    //     if (itemData.createdAt) {
    //         itemData.createdAt = new Date(itemData.createdAt)
    //     }
    //     if (itemData.updatedAt) {
    //         itemData.updatedAt = new Date(itemData.updatedAt)
    //     }
    //     const Entity = ModelEntity.fromValues(itemData, item.uuid)
    //     if (isError(Entity)) {
    //         return Entity
    //     }
    //     if ('category' in itemData && itemData.category) {
    //         const categoryRepository = new CategoryRepository()
    //         const category = categoryRepository.mapToEntity(
    //             itemData.category as CategoryTable
    //         )
    //         if (!isError(category)) {
    //             Entity.category = category
    //         }
    //     }

    //     // if ('media' in item) {
    //     //     const assetRepository = new AssetRepository()
    //     //     const galleryItem = assetRepository.mapToEntity(
    //     //         item.media as AssetTable
    //     //     )
    //     //     if (!isError(galleryItem)) {
    //     //         Entity.image = galleryItem
    //     //     }
    //     // }
    //     if ('submissions' in item && typeof item.submissions !== 'undefined') {
    //         Entity.submissions = item.submissions
    //     }
    //     if ('submissionCount' in item && typeof item.submissionCount !== 'undefined') {
    //         Entity.submissionCount = item.submissionCount
    //     }
    //     if ('lastSubmitted' in item && typeof item.lastSubmitted !== 'undefined' && item.lastSubmitted) {
    //         Entity.lastSubmitted = item.lastSubmitted.toString()
    //     }
    //     if ('category' in item && typeof item.category !== 'undefined' && item.category) {
    //         Entity.categoryName = item.category.toString()
    //     }

    //     return Entity
    // }



}


// function convertCase(obj: any) {
//     const result: Record<string, string> = {}
//     const camelCaseColumns: Record<string, string> = {
//         category_uuid :'categoryUuid',
//         topic_id :'topicId',
//         course_id : 'courseId',
//         starter_code:'starterCode',
//         answer_code:'answerCode', 
//         is_deleted: 'isDeleted',
//         image_uuid: 'imageUuid', 
//         is_seeded: 'isSeeded', 
//         created_at: 'createdAt',
//         updated_at: 'updatedAt',
//         // submission_count: 'submissionCount',
//         last_submission: 'lastSubmission'
//     }

//     for (let [key, value] of Object.entries(camelCaseColumns)) {
//         if (typeof obj[key] !== 'undefined') {
//             result[value] = obj[key]
//             delete obj[key]
//         }
//     }
//     return { ...obj, ...result }
// }


export default Repository

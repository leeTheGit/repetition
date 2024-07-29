import DynamoComponent from '@repetition/core/lib/aws/DynamoComponent'

import { FetchParams } from '@repetition/core/code/Validators'
import { ModelError, isError, not } from '@repetition/core/types'
import { RunnerEntity as ModelEntity } from '@repetition/core/code/RunnerEntity' 

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
        console.log('identifier', identifier)
        const item = await Dynamo.getItem(identifier)
        console.log('repository', item)
        if (not(item)) {
            return item
        }
        return this.mapToEntity(item)
    }


    async create(data: any) {
        const saved = await Dynamo.putItem(data)
        return saved;
    }


    mapToEntity(item: any) {
        // console.log("item from database", item)
        // if (item.submittedAt) {
        //     item.submittedAt = new Date(item.createdAt)
        // }
        item.logs = JSON.parse(item.logs)
        console.log("got the logs", item.logs)
        item.answer = JSON.parse(item.answer)
        const Entity = ModelEntity.fromValues(item, item.id)
        console.log('did it work', Entity)
        if (isError(Entity)) {
            return Entity
        }



        return Entity
    }



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

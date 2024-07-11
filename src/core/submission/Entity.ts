import { Entity } from '@/core/baseEntity'
import { entitySchema, EntitySchema } from './Validators'
import { getZodErrors, randomNumbers } from '@/lib/utils'
import { ModelError } from '../types'

export class SubmissionEntity extends Entity<EntitySchema> {
    private relations: {} = {}

    constructor(props: EntitySchema, id?: string) {
        super(props, id)
    }

    toObject(): EntitySchema {
        return {
            ...this.props,
        }
    }

    static fromValues(
        values: EntitySchema,
        id?: string
    ): SubmissionEntity | ModelError {
        const data = entitySchema.safeParse(values)
        if (!data.success) {
            return { error: getZodErrors(data) }
        }

        const entity = new SubmissionEntity(data.data, id)

        return entity
    }

    get id() {
        return this.props.id
    }

    get uuid() {
        return this.props.uuid
    }


    get problemUuid() {
        return this.props.problemUuid
    }

    get note() {
        return this.props.note
    }

    get grade() {
        return this.props.grade
    }

    get solution() {
        return this.props.solution
    }



    get createdAt() {
        return this.props.createdAt
    }
}

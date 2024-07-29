import { z } from 'zod'

import { Entity } from '@repetition/core/baseEntity'
import { entitySchema, EntitySchema } from './Validators'
import { getZodErrors, randomNumbers } from '@repetition/core/lib'
import { ModelError } from '@repetition/core/types'

export class RunnerEntity extends Entity<EntitySchema> {
    private relations: {} = { }

    private metadata: {} = {}

    private constructor(props: EntitySchema, id?: string) {
        super(props, id)
    }

    data(): EntitySchema {
        return this.props
    }
    toObject(): EntitySchema & {
    } {
        return {
            ...this.props,
        }
    }

    static fromValues(
        values: EntitySchema,
        id?: string
    ): RunnerEntity | ModelError {

        const data = entitySchema.safeParse(values)
        
        if (!data.success) {
            return { error: getZodErrors(data) }
        }

        const ProgramEntity = new RunnerEntity(data.data, id)

        return ProgramEntity
    }

    get id() {
        return this.props.id
    }

    get logs() {
        return this.props.logs
    }

    get answers() {
        return this.props.answer
    }
    get submittedAt() {
        return this.props.submittedAt
    }

}

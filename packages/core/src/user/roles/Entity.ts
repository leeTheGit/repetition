import { Entity } from '@repetition/core/baseEntity'
import { entitySchema, EntitySchema } from './Validators'
import { getZodErrors } from '@repetition/core/lib'
import { ModelError } from '@repetition/core/types'

export class RoleEntity extends Entity<EntitySchema> {
    private relations: {} = {}

    private constructor(props: EntitySchema, id?: string) {
        super(props, id)
    }

    toObject(): EntitySchema | null {
        return {
            ...this.props,
        }
    }

    static fromValues(
        values: EntitySchema,
        id?: string
    ): RoleEntity | ModelError {
        const data = entitySchema.safeParse(values)

        if (!data.success) {
            return { error: getZodErrors(data) }
        }

        return new RoleEntity(data.data, id)
    }

    get id() {
        return this.props.id
    }

    get uuid() {
        return this.props.uuid
    }

    get organisationUuid() {
        return this.props.organisationUuid
    }

    get name() {
        return this.props.name
    }

    get slug() {
        return this.props.slug
    }

    get description() {
        return this.props.description
    }

    get createdAt() {
        return this.props.createdAt
    }
    get updatedAt() {
        return this.props.updatedAt
    }
}

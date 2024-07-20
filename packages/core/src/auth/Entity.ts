import { Entity } from '@repetition/core/baseEntity'
import { entitySchema, EntitySchema } from '@repetition/core/auth/Validators'
import { getZodErrors } from '@repetition/core/lib/utils'
import { ModelError } from '@repetition/core/types'
import { createUuid } from '@repetition/core/lib/utils'
import { UserEntity } from '@repetition/core/user/Entity'

export class TokenEntity extends Entity<EntitySchema> {
    // private data won't be included when running toObject()
    private privateData = ['token']
    private relations: {
        user?: UserEntity
    } = {}

    constructor(props: EntitySchema, id?: string) {
        super(props, id)
    }

    toObject(): EntitySchema {
        // destruct all own properties
        // (not methods in prototype)
        const props = { ...this.props }

        // // props.token needs to be marked as optional in the type to remove
        // // this error, however it's a bit heavy handed for this one case
        // //@ts-ignore
        // delete props.token
        return props
    }

    static fromValues(
        values: EntitySchema,
        id?: string
    ): TokenEntity | ModelError {
        const data = entitySchema.safeParse(values)

        if (!data.success) {
            return { error: getZodErrors(data) }
        }

        const entity = new TokenEntity(data.data, id)

        return entity
    }

    get id() {
        return this.props.id
    }

    get organisationUuid() {
        return this.props.organisationUuid
    }

    get name() {
        return this.props.name
    }

    get type() {
        return this.props.type
    }

    get identifier() {
        return this.props.identifier
    }

    get token() {
        return this.props.token
    }

    get description() {
        return this.props.description
    }

    get status() {
        return this.props.status
    }

    get expiresAt() {
        return this.props.expiresAt
    }

    get createdAt() {
        return this.props.createdAt
    }

    public static generateToken() {
        return createUuid()
    }

    get user(): UserEntity | undefined {
        return this.relations.user
    }
    set user(user: UserEntity) {
        this.relations.user = user
    }
}

import { Entity } from '@/core/baseEntity'
import { entitySchema, EntitySchema } from '@/core/auth/account/Validators'
import { getZodErrors } from '@/lib/utils'
import { ModelError } from '@/core/types'
import { createUuid } from '@/lib/utils'
import { UserEntity } from '@/core/user/Entity'

export class AccountEntity extends Entity<EntitySchema> {
    // private data won't be included when running toObject()
    private privateData = []
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

        return props
    }

    static fromValues(
        values: EntitySchema,
        id?: string
    ): AccountEntity | ModelError {
        const data = entitySchema.safeParse(values)

        if (!data.success) {
            return { error: getZodErrors(data) }
        }

        const entity = new AccountEntity(data.data, id)

        return entity
    }

    get id() {
        return this.props.id
    }

    get userId() {
        return this.props.userId
    }

    get accountType() {
        return this.props.accountType
    }

    get githubId() {
        return this.props.githubId
    }

    get googleId() {
        return this.props.googleId
    }

    get user(): UserEntity | undefined {
        return this.relations.user
    }

    set user(user: UserEntity) {
        this.relations.user = user
    }

}

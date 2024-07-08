import { Entity } from '@/core/baseEntity'
import { entitySchema, EntitySchema } from './Validators'
import { getZodErrors } from '@/lib'
import { ModelError } from '@/core/types'
import { AssetEntity } from '@/core/asset/AssetEntity'
import { RoleEntity } from '@/core/user/roles/Entity'
import { EntitySchema as AssetEntitySchema } from '@/core/asset/AssetValidators'

export class UserEntity extends Entity<EntitySchema> {
    private relations: {
        role?: RoleEntity
        profileImage?: AssetEntity
    } = {}

    private constructor(props: EntitySchema, id?: string) {
        super(props, id)
    }

    toObject(): EntitySchema & { profileImage?: AssetEntitySchema | null } & {
        profileImage?: AssetEntitySchema | null
    } {
        return {
            ...this.props,
            profileImage: this.relations.profileImage?.toObject() || null,
        }
    }

    static fromValues(
        values: EntitySchema,
        id?: string
    ): UserEntity | ModelError {
        const data = entitySchema.safeParse(values)

        if (!data.success) {
            return { error: getZodErrors(data) }
        }

        const ProgramEntity = new UserEntity(data.data, id)

        return ProgramEntity
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

    get username() {
        return this.props.username
    }

    get firstname() {
        return this.props.firstname
    }
    get lastname() {
        return this.props.lastname
    }
    get email() {
        return this.props.email
    }

    get status() {
        return this.props.status
    }

    get isDeleted() {
        return this.props.isDeleted
    }

    get profileImageId() {
        // the type for this entity comes from Drizzle Zod which seems
        // to force imageUuid to be a string, due to being a foreign
        // key to Media which is set to not allow null. But it CAN be
        // null in the product table
        //@ts-ignore
        return this.props.profileImageId
    }

    set profileImageId(uuid: string) {
        this.props.profileImageId = uuid
    }

    get createdAt() {
        return this.props.createdAt
    }
    get updatedAt() {
        return this.props.updatedAt
    }

    set profileImage(image: AssetEntity) {
        this.relations.profileImage = image
    }

    get profileImage(): AssetEntity | null {
        return this.relations.profileImage || null
    }
    set hashedPassword(password:string) {
        this.props.hashedPassword = password
    }
    set role(role: RoleEntity) {
        this.relations.role = role
    }

    get role(): RoleEntity | null {
        return this.relations.role || null
    }
}

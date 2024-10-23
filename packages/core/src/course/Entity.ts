import { Entity } from '@repetition/core/baseEntity'
import { insertSchema, InsertSchema, entitySchema, EntitySchema } from './Validators'
import { getZodErrors, randomNumbers } from '@repetition/core/lib'
import { ModelError } from '@repetition/core/types'
import { AssetEntity } from '@repetition/core/asset/AssetEntity'
import { EntitySchema as AssetEntitySchema } from '@repetition/core/asset/AssetValidators'


export abstract class BaseCourseEntity<T> extends Entity<T> {
    protected relations: {
        courseImage?: AssetEntity
    } = {}
    protected metadata: {} = {}

    public constructor(props: T, id?: string) {
        super(props, id)
    }

    data(): T {
        return this.props
    }


    public toObject(): T & { courseImage?: AssetEntitySchema | null } & {
        courseImage?: AssetEntitySchema | null
    } {
        return {
            ...this.props,
            courseImage: this.relations.courseImage?.toObject() || null,
        }
    }


    get imageUuid() {
        // the type for this entity comes from Drizzle Zod which seems
        // to force imageUuid to be a string, due to being a foreign
        // key to Media which is set to not allow null. But it CAN be
        // null in the product table
        //@ts-ignore
        return this.props.imageUuid || null
    }


    set courseImage(image: AssetEntity) {
        this.relations.courseImage = image
    }

    get courseImage(): AssetEntity | null {
        return this.relations.courseImage || null
    }
}

export class CourseEntity extends BaseCourseEntity<EntitySchema> {

    public constructor(props: EntitySchema, id?: string) {
        super(props, id)
    }


    static fromValues(
        values: EntitySchema,
        id?: string
    ): CourseEntity | ModelError {

        let data = entitySchema.safeParse(values)
        if (!data.success) {
            return { error: getZodErrors(data) }
        }
        
        return new CourseEntity(data.data, id)

    }
    get id() {
        return this.props.id
    }

    get uuid() {
        return this.props.uuid
    }
    get name() {
        return this.props.name
    }

    get status() {
        return this.props.status
    }
    get description() {
        return this.props.description
    }
    set imageUuid(uuid: string | null) {
        this.props.imageUuid = uuid
    }
    get slug() {
        return this.props.slug
    }

    get organisationUuid() {
        return this.props.organisationUuid
    }
    set organisationUuid(id: string) {
        this.props.organisationUuid = id
    }
    get createdAt() {
        return this.props.createdAt
    }

    uniqueSlug() {
        this.props.slug = this.props.slug + randomNumbers(1)
    }
 

}

export class PartialCourseEntity extends BaseCourseEntity<InsertSchema> {
    public constructor(props: InsertSchema) {
        super(props)
    }
    static fromValues(
        values: InsertSchema,
        id?: string
    ): PartialCourseEntity | ModelError {

        let data = insertSchema.safeParse(values)
        if (!data.success) {
            return { error: getZodErrors(data) }
        }
        return new PartialCourseEntity(data.data)

    }

    get organisationUuid() {
        return this.props.organisationUuid
    }
    set organisationUuid(id: string) {
        this.props.organisationUuid = id
    }

    /**
     * The repository class will run this recursively, adding
     * another random digit each time until slug is unique
    */
    uniqueSlug() {
        this.props.slug = this.props.slug + randomNumbers(1)
    }


}

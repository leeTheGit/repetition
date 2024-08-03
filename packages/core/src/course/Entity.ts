import { z } from 'zod'

import { Entity } from '@repetition/core/baseEntity'
import { entitySchema, EntitySchema } from './Validators'
import { getZodErrors, randomNumbers } from '@repetition/core/lib'
import { ModelError } from '@repetition/core/types'
import { AssetEntity } from '@repetition/core/asset/AssetEntity'
import { EntitySchema as AssetEntitySchema } from '@repetition/core/asset/AssetValidators'


export class CourseEntity extends Entity<EntitySchema> {
    private relations: {
        courseImage?: AssetEntity
    } = {}
    private metadata: {
    } = {}

    private constructor(props: EntitySchema, id?: string) {
        super(props, id)
    }

    data(): EntitySchema {
        return this.props
    }

    toObject(): EntitySchema & { courseImage?: AssetEntitySchema | null } & {
        courseImage?: AssetEntitySchema | null
    } {
        return {
            ...this.props,
            courseImage: this.relations.courseImage?.toObject() || null,
        }
    }

    static fromValues(
        values: EntitySchema,
        id?: string
    ): CourseEntity | ModelError {

        const data = entitySchema.safeParse(values)
        
        if (!data.success) {
            return { error: getZodErrors(data) }
        }

        const ProgramEntity = new CourseEntity(data.data, id)

        return ProgramEntity
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

    get imageUuid() {
        // the type for this entity comes from Drizzle Zod which seems
        // to force imageUuid to be a string, due to being a foreign
        // key to Media which is set to not allow null. But it CAN be
        // null in the product table
        //@ts-ignore
        return this.props.imageUuid || null
    }

    get slug() {
        return this.props.slug
    }

    set courseImage(image: AssetEntity) {
        this.relations.courseImage = image
    }

    get courseImage(): AssetEntity | null {
        return this.relations.courseImage || null
    }


    /**
     * The repository class will run this recursively, adding
     * another random digit each time until slug is unique
     */
    uniqueSlug() {
        this.props.slug = this.props.slug + randomNumbers(1)
    }

    get createdAt() {
        return this.props.createdAt
    }

}

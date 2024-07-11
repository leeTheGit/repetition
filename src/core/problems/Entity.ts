import { z } from 'zod'

import { Entity } from '@/core/baseEntity'
import { CategoryEntity } from '@/core/category/Entity'
import { SubmissionEntity } from '@/core/submission/Entity'
import { entitySchema, EntitySchema } from './Validators'
import { getZodErrors, randomNumbers } from '@/lib'
import { ModelError } from '@/core/types'

export class ProblemEntity extends Entity<EntitySchema> {
    private relations: {
        category?: CategoryEntity,
        submissions?: SubmissionEntity[]
    } = { }

    private metadata: {
        submissionCount?: number
    } = {}

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
    ): ProblemEntity | ModelError {

        const data = entitySchema.safeParse(values)
        
        if (!data.success) {
            return { error: getZodErrors(data) }
        }

        const ProgramEntity = new ProblemEntity(data.data, id)

        return ProgramEntity
    }

    get id() {
        return this.props.id
    }

    get uuid() {
        return this.props.uuid
    }


    get categoryUuid() {
        return this.props.categoryUuid
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

    get difficulty() {
        return this.props.difficulty
    }
    get starterCode() {
        return this.props.starterCode
    }
    get answerCode() {
        return this.props.answerCode
    }

    get history() {
        return this.relations.submissions?.map(s => {
            return s.grade 
        }) || []
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

    get category(): CategoryEntity | null {
        return this.relations.category || null
    }

    get categoryName() {
        return this.relations.category?.name
    }


    set category(category: CategoryEntity) {
        this.relations.category = category
    }

    get lastSubmitted() {
        const submissions = this.relations.submissions;
        if (submissions && submissions.length > 0) {
            // console.log(submissions[0].createdAt)
            return submissions[0].createdAt
        }
        
        return null;
        // return this.relations.submissions?[0].createdAt
        // return this.relations.submissions?[0].name
    }

    set submissions(submissions: SubmissionEntity[]) {
        this.relations.submissions = submissions
    }

    get submissionCount() {
        return this.metadata.submissionCount || 0
    }

    set submissionCount(count: number) {
        this.metadata.submissionCount = count
    }
}

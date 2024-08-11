import { z } from 'zod'

import { Entity } from '@repetition/core/baseEntity'
import { CategoryEntity } from '@repetition/core/category/Entity'
import { SubmissionEntity } from '@repetition/core/submission/Entity'
import { entitySchema, EntitySchema } from './Validators'
import { getZodErrors, randomNumbers } from '@repetition/core/lib'
import { ModelError } from '@repetition/core/types'

export class ProblemEntity extends Entity<EntitySchema> {
    private relations: {
        category?: CategoryEntity,
        submissions?: SubmissionEntity[]
    } = { }

    private metadata: {
        submissionCount?: number,
        lastSubmitted?: string,
        categoryName?: string
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

    get courseId() {
        return this.props.courseId
    }
    get categoryUuid() {
        return this.props.categoryUuid
    }

    get name() {
        return this.props.name
    }
    
    get link() {
        return this.props.link
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

    get testCode() {
        return this.props.testCode || ""
    }

    get answerCode() {
        return this.props.answerCode
    }

    get type() {
        return this.props.type
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
        return this.relations.category?.name || this.metadata.categoryName || ""
    }

    set categoryName(name: string) {
        this.metadata.categoryName = name
    }


    set category(category: CategoryEntity) {
        this.relations.category = category
    }

    get lastSubmitted(): string | null {
        return this.metadata.lastSubmitted || null 
    }
    set lastSubmitted(date: string) {
        this.metadata.lastSubmitted = date
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

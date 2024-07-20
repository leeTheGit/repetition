import { Entity } from '@repetition/core/baseEntity'
import { ModelError } from '@repetition/core/types'
import { entitySchema, EntitySchema } from '@repetition/core/asset/log/Validators'
import { getZodErrors } from '@repetition/core/lib/utils'

export class AssetLogEntity extends Entity<EntitySchema> {
    private relations = {}
    // private metadata: {
    //     order?: number
    //     isFeatured?: boolean
    // } = {}

    constructor(props: EntitySchema, id?: string) {
        super(props, id)
    }

    data(): EntitySchema {
        return this.props
    }

    toObject(): EntitySchema {
        return { ...this.props }
    }

    static fromValues(
        values: EntitySchema,
        id?: string
    ): AssetLogEntity | ModelError {
        const data = entitySchema.safeParse(values)

        if (!data.success) {
            return { error: getZodErrors(data) }
        }

        const entity = new AssetLogEntity(data.data, id)

        return entity
    }

    get uuid() {
        return this.props.uuid
    }
    get organisationUuid() {
        return this.props.organisationUuid
    }
    get storeUuid() {
        return this.props.storeUuid
    }

    get assetUuid() {
        return this.props.mediaUuid
    }
    get resource() {
        return this.props.resource
    }
    get resourceUuid() {
        return this.props.resourceUuid
    }
    get resourceAttribute() {
        return this.props.resourceAttribute
    }
}

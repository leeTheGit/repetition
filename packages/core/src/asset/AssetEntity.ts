import { Entity } from "@repetition/core/baseEntity"
import { ModelError } from "../types";
import { entitySchema, EntitySchema } from "@repetition/core/asset/AssetValidators"
import { getZodErrors } from "@repetition/core/lib/utils";


export class AssetEntity extends Entity<EntitySchema> {
   
    private relations = {}
    private metadata: {
        order?:number,
        isFeatured?: boolean,
    } = {}

    
    constructor(props: EntitySchema, id?: string ) {
        super(props, id);
    }


    data(): EntitySchema {
        return this.props;
    }

    toObject(): EntitySchema {
        return {...this.props, ...this.metadata};
    }

    static fromValues(values: EntitySchema, id?: string): AssetEntity | ModelError {
        const data = entitySchema.safeParse(values);
        
        if (!data.success) {
            return {error: getZodErrors(data)};
        }

        const entity = new AssetEntity( data.data, id );

        return entity;
    }



    get id() {
        return this.props.id;
    }
    get uuid() {
        return this.props.uuid;
    }
    get organisationUuid() {
        return this.props.organisationUuid;
    }

    get title() {
        return this.props.title;
    }

    get description() {
        return this.props.description;
    }

    get caption() {
        return this.props.caption;
    }
    get filename() {
        return this.props.filename;
    }
    get filesize() {
        return this.props.filesize;
    }
    get filetype() {
        return this.props.filetype;
    }
    get tags() {
        return this.props.tags;
    }
    get altText() {
        return this.props.altText;
    }

    get width() {
        return this.props.width;
    }
    get height() {
        return this.props.height;
    }

    get cdnUrl() {
        return this.props.cdnUrl;
    }

    get updatedAt() {
        return this.props.updatedAt;
    }
    get createdAt() {
        return this.props.createdAt;
    }
    get type() {
        return this.props.type;
    }


    get order() {
        return this.metadata.order || 0;
    }
    set order(value: number) {
        this.metadata.order = value;
    }

    get isFeatured() {
        return this.metadata.isFeatured || false;
    }
    set isFeatured(value: boolean) {
        this.metadata.isFeatured = value;
    }



}
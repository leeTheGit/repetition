import { Entity } from "@/core/baseEntity"
import { entitySchema, EntitySchema, insertSchema, InsertSchema } from "@/core/organisation/Validators"
import { getZodErrors, randomNumbers } from "@/lib/utils";
import { ModelError } from "@/core/types";


export class OrganisationEntity extends Entity<EntitySchema> {
  
    constructor(props: EntitySchema, id?: string ) {
        super(props, id);
    }

    toObject(): EntitySchema {
        return {...this.props};
    }

    static fromValues(values: EntitySchema, id?: string): OrganisationEntity | ModelError {
        const data = entitySchema.safeParse(values);
        if (!data.success) {
            return {error: getZodErrors(data)};
        }

        const entity = new OrganisationEntity( data.data, id );

        return entity;
    }


    get id() {
        return this.props.id;
    }
    
    get uuid() {
        return this.props.uuid;
    }
    
    get name() {
        return this.props.name;
    }
    
    get domain() {
        return this.props.domain;
    }


    /**
     * The repository class will run this recursively, adding
     * another random digit each time until slug is unique
    */
    uniqueSubDomain(step: number = 1) {
        this.props.domain = this.props.domain + randomNumbers(step);
    }

    get timezone() {
        return this.props.timezone;
    }

    get email() {
        return this.props.email
    }
    get replyEmail() {
        return this.props.replyEmail
    }
    get logo() {
        return this.props.logo;
    }

    get logoReverse() {
        return this.props.logoReverse;
    }

    get createdAt() {
        return this.props.createdAt;
    }

}
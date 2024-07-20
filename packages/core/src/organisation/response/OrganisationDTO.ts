import { OrganisationEntity } from '@repetition/core/organisation/Entity'




export const fetchResponse = (res: OrganisationEntity) => {
    return { 
        "id": res.id,
        "uuid": res.uuid,
        "createdAt": res.createdAt
    }
}
import { AssetEntity } from '@/core/asset/AssetEntity'


export const createResponse = (res: AssetEntity) => {

    return { 
        "id": res.id,
        "uuid": res.uuid,
        "title": res.title,
        "url": res.cdnUrl,
        "altText": res.altText,
        "createdAt": res.createdAt,
    }
}


export const fetchResponse = (res: AssetEntity) => {
    return {
        
        "id": res.id,
        "uuid": res.uuid,
        "title": res.title,
        "description": res.description,
        "caption": res.caption,
        "filename": res.filename,
        "filesize": res.filesize,
        "filetype": res.filetype,
        "tags": res.tags,
        "altText": res.altText,
        "width": res.width,
        "height": res.height,
        "cdnUrl": res.cdnUrl,
        "url": res.cdnUrl,
        "updatedAt": res.updatedAt,
        "createdAt": res.createdAt,

   }
}
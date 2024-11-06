import { db } from '@repetition/core/lib/db'
import { NextRequest } from 'next/server'
import AssetRepository from '@repetition/core/asset/AssetRepository'
import { isError, ModelError } from '@repetition/core/types'
import { postParams, fetchParams } from '@repetition/core/asset/AssetValidators'
import { fetchResponse } from '@repetition/core/asset/response/AssetDTO'
import { HttpResponse, apiHandler } from '@/lib'
import { logger } from '@repetition/core/lib/logger'
import UserRepository from '@repetition/core/user/Repository'
import ProblemRepository from '@repetition/core/problems/Repository'
import CourseRepository from '@repetition/core/course/Repository'
import AssetLogRepository from '@repetition/core/asset/log/Repository'
import { UserEntity } from '@repetition/core/user/Entity'
import { CourseEntity } from '@repetition/core/course/Entity'
import { ProblemEntity } from '@repetition/core/problems/Entity'

const assetRepository = new AssetRepository()
const problemRepository = new ProblemRepository(db)
const userRepository = new UserRepository()
const courseRepository = new CourseRepository()
const logRepository = new AssetLogRepository()

// export const GET = apiHandler(get, { validator: fetchParams })
export const POST = apiHandler(post, { validator: postParams })


// async function get(
//     req: NextRequest,
//     { params }: { params: { storeId: string } },
//     ctx: any
// ) {
//     try {
//         const params = {
//             ...ctx.data,
//             storeId: ctx.store.uuid,
//             organisationId: ctx.user.organisationUuid,
//         }

//         const Assets = await Repository.fetchAll(params)

//         if (isError(Assets)) {
//             return Assets
//         }

//         return HttpResponse(Assets, fetchResponse)
//     } catch (error) {
//         logger.info('[ASSETS_GET]', error)
//         return {
//             error: 'Internal error',
//         }
//     }
// }



async function post(
    req: Request,
    { params }: { params: { storeId: string } },
    ctx: any
) {
    try {
        let userId = ctx.user.id

        // **************************************************************
        //  Check that the record the asset is being attached to exists
        // **************************************************************
        var entity:
            | ProblemEntity
            | UserEntity
            | CourseEntity
            | null
            | ModelError = null
        // var entity: unknown | null;

        let EntityUuid = null

        if (ctx.data.entity !== null) {

            if (ctx.data.entity === 'user') {
                entity = (await userRepository.fetchByUuid(
                    ctx.data.entity_uuid
                )) as UserEntity
            }

            if (ctx.data.entity === 'problem') {
                entity = (await problemRepository.fetchByUuid(
                    ctx.data.entity_uuid
                )) as ProblemEntity
            }

            if (ctx.data.entity === 'course') {
                entity = (await courseRepository.fetchByUuid(
                    ctx.data.entity_uuid
                )) as CourseEntity
            }

            if (!entity || isError(entity)) {
                return {
                    error: 'Entity not found',
                }
            }
            EntityUuid = entity.uuid as string
        }

        // **************************************************************
        //              Save the asset to the media table
        // **************************************************************
        const transaction = await db.transaction(async (tx) => {
            const assetData = {
                width: ctx.data.width || 0,
                height: ctx.data.height || 0,
                title: ctx.data.title || null,
                organisationUuid: ctx.user.organisationUuid,
                storeUuid: ctx.data.storeId,
                cdnUrl: ctx.data.url,
                storageUrl: ctx.data.url,
                type: ctx.data.type,
                name: ctx.data.name,
                assetType: ctx.data.assetType,
                userUuid: userId,
                copyright: ctx.data.copyright,
                source: ctx.data.source,
                private: ctx.data.private,
                filename: ctx.data.filename,
                filesize: ctx.data.filesize,
                filetype: ctx.data.filetype,
                description: ctx.data.description || null,
                altText: ctx.data.altText || null,
                caption: ctx.data.caption || null,
                tags: ctx.data.tags || null,
            }

            const Asset = await assetRepository.create(assetData)

            if (isError(Asset)) {
                tx.rollback()
                return Asset
            }

            console.log('the entity', ctx.data)
            // **************************************************************
            //         Attach the saved asset to the Entity table
            // **************************************************************
            if (EntityUuid !== null && entity) {
                try {
                    let entityId = null

                    // if (ctx.data.entity === 'user') {
                    //     if (ctx.data.entityAttribute) {
                    //         await userRepository.update(EntityUuid, {
                    //             [ctx.data.entityAttribute]: Asset.uuid,
                    //         })
                    //     }
                    // }
                    // if (ctx.data.entity === 'course') {
                    //     if (ctx.data.entityAttribute) {
                    //         await courseRepository.update(EntityUuid, {
                    //             [ctx.data.entityAttribute]: Asset.uuid,
                    //         })
                    //     }
                    // }

                    if (ctx.data.entity === 'problem') {
                        if (
                            'imageUuid' in entity &&
                            entity.imageUuid === null
                        ) {
                            entity.imageUuid = Asset.uuid
                            const saved = await problemRepository.save(
                                entity as ProblemEntity
                            )
                        }

                        // entityId = await problemRepository.addToAssets({
                        //     storeUuid: ctx.data.storeId,
                        //     productUuid: EntityUuid,
                        //     mediaUuid: Asset.uuid,
                        // })
                    }
                } catch ({ name, message }: any) {
                    tx.rollback()
                    logger.info('[ASSET SAVING ERROR]', message)
                    return {
                        error: message,
                    }
                }

                const addToLog = await logRepository.create({
                    organisationUuid: ctx.user.organisationUuid,
                    mediaUuid: Asset.uuid,
                    resource: ctx.data.entity,
                    resourceAttribute: ctx.data.entityAttribute || null,
                    resourceUuid: EntityUuid,
                })
                if (isError(addToLog)) {
                    tx.rollback()
                    return addToLog
                }
            }
            return {
                entity: ctx.data.entity,
                asset: HttpResponse(Asset, fetchResponse),
            }
        })

        return transaction
    } catch (error) {
        logger.info('[ASSET_POST]', error)
        return {
            error: 'Internal error',
        }
    }
}




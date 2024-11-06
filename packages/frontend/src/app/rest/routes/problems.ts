// import { db } from '@repetition/core/lib/db'
// import { Hono } from 'hono'
// import { checkAuth } from '../middleware'
// import { 
//     patchSchema, 
//     apiInsertSchema,
//     fetchParams, 
//     fetchByUuid,
//     FetchParams
// } from '@repetition/core/problems/Validators'

// import { zValidator} from '@repetition/core/lib/zValidator'
// import { isError } from '@repetition/core/types'

// import { HttpResponse, Respond, formattedError, uuidRegex } from '@repetition/core/lib'
// import { fetchResponse } from '@repetition/core/problems/response/ProblemDTO'
// import Repository from '@repetition/core/problems/Repository'
// import { logger } from '@repetition/core/lib/logger'


// const repository = new Repository(db)
// const resource = "Problems"

// export const route = new Hono()

// route.get(
//     '/',
//     checkAuth,
//     zValidator("query", fetchParams, formattedError),
//     zValidator("param", fetchByUuid, formattedError),
//     async (c) => { 
//         const params = c.req.valid("query")


//         try {

//             let input = {
//                 ...params,
//             }

//             const Entity = await repository.fetchAll(input)
//             if (isError(Entity)) {
//                 return Respond(Entity)
//             }
                
//             return Respond(HttpResponse(Entity, fetchResponse))

//         } catch (error) {
//             return Respond({
//                 error: 'Internal error',
//             })
//         }
//     }
// )



// route.get(
//     '/:entityId',
//     checkAuth,
//     zValidator("param", fetchByUuid, formattedError),
//     async (c) => {

//         const {entityId} = c.req.valid("param")

//         try {
//             if (!entityId) {
//                 return Respond({
//                     error: `${resource} id is required`, 
//                     status: 400
//                 })
//             }

//             const Entity = await repository.fetchByUuid(entityId)

//             if (isError(Entity)) {
//                 return Respond({
//                     error: Entity.error,
//                     status: 404,
//                 })
//             }

//             return Respond(HttpResponse(Entity, fetchResponse))
            

//         } catch (error) {
//             logger.info(`[${resource.toUpperCase()}_GET]`, error)
//             return Respond({
//                 error: 'Internal error',
//             })
//         }
//     }
// )


// route.post(
//     "/",
//     checkAuth,
//     zValidator("json", apiInsertSchema, formattedError),
//     async(c) => {

//         const user = c.var.user
//         const input = c.req.valid('json')
        
//         try {
//             const data = {
//                 ...input,
//                 organisationUuid: user.organisationUuid,
//             }
//             const newEntity = await repository.create(data)

//             if (isError(newEntity)) {
//                 return Respond( newEntity )
//             }
    
//             return Respond( newEntity.toObject(), "POST" )
            
//         } catch (error) {
//             logger.info(`[${resource.toUpperCase()}_POST]`, error)
//             return Respond( {
//                 error: 'Internal error',
//             } )
//         }
//     }
// )


// route.patch(
//     ':entityId',
//     checkAuth,
//     zValidator("param", fetchByUuid, formattedError),
//     zValidator("json", patchSchema, formattedError),
//     async(c) => {
//         try {
//             const {entityId} = c.req.valid("param")
//             const data = c.req.valid("json")
//             const update = await repository.update(entityId, data)

//             if (isError(update)) {
//                 return Respond({
//                     error: 'Error updating product',
//                 })
//             }
//             return Respond({
//                 update,
//             })
            
//         } catch (error) {
//             logger.info(`[${resource.toUpperCase()}_PATCH]`, error)
//             return Respond({
//                 error: 'Internal error',
//             })
//         }
//     }
// )

// route.delete(
//     ':entityId',
//     checkAuth,
//     zValidator("param", fetchByUuid, formattedError),
//     async(c) => {
//         try {

//             const {entityId} = c.req.valid("param") 
//             const del = await repository.delete(entityId)

//             if (isError(del)) {
//                 logger.info(`ERROR DELETING ${resource.toUpperCase()}`, del)
//                 return Respond(del)
//             }

//             return c.text(`${resource} deleted`)
//         } catch (error) {
//             logger.info(`[${resource.toUpperCase()}_DELETE]`, error)
//             return Respond({
//                 error: 'Internal error',
//             })
//         }
//     }
// )
import { HttpResponse, apiHandler } from '@/lib'
import { logger } from '@repetition/core/lib/logger'
import EventBridgeComponent from '@repetition/core/lib/aws/EventBridgeComponent'
import Repository from '@repetition/core/code/Repository'
import ProblemRepository from '@repetition/core/problems/Repository'
import { randomNumbers } from '@repetition/frontend/lib'
import { fetchBySubmission, postTestCode } from '@repetition/core/code/Validators'
import { fetchResponse } from '@repetition/core/code/response/RunnerDTO'
import { not } from '@repetition/core/types'


const repository = new Repository()
const problemRepository = new ProblemRepository()

const name = 'Code'

const eventBridge = new EventBridgeComponent()
type EventDetail = {
    user_id: string,
    submission_id: string,
    user_code: string,
    test_code: string

}
export const GET = apiHandler(get, {validator: fetchBySubmission})
export const POST = apiHandler(post, {validator: postTestCode})

async function get(
    req: Request,
    {}: {},
    ctx:any
) {
    console.log('[CODE ROUTE] submission', ctx.data)
    const submissionId = ctx.data.submissionId
    const userId = ctx.user.identity || ctx.user.id
    if (!userId) {
        return {
            error: "User auth error"
        }
    }
    // console.log("the id", userId + "_" + submissionId )
    const ok = await repository.fetchByUuid(userId + "_" + submissionId)
    if (not(ok)) {
        return {
            status: 404,
            error: ok.error
        }
    }
    return HttpResponse(ok, fetchResponse)
}

async function post(
    req: Request,
    {}: {},
    ctx: any
) {
    try {

        const problem = await problemRepository.fetchByUuid(ctx.data.problemId)
        if (not(problem)) {
            return {
                error: "Missing problem id"
            }
        }

        const testCode = problem.testCode;

        let body = ctx.data.code

        const userId = ctx.user.id;
        const submissionId = randomNumbers();

        console.log('[ROUTE] triggering....')
        const trigger = await eventBridge.send<EventDetail>({
            user_id: userId,
            submission_id: submissionId,
            user_code: body.replace(/console\.log/g, "process.stdout.write"),
            test_code: testCode
        })

        console.log("[ROUTE] trigger", trigger)

        return submissionId

        
    } catch (error) {
        console.log('in the error')
        logger.info(`[ERROR] [${name.toUpperCase()}_POST]`, error)
        return {
            error: 'Internal error',
        }
    }
}

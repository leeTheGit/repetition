import { HttpResponse, apiHandler } from '@/lib'
import { logger } from '@repetition/core/lib/logger'
import EventBridgeComponent from '@repetition/core/lib/aws/EventBridgeComponent'
import Repository from '@repetition/core/code/Repository'
import { randomNumbers } from '@repetition/frontend/lib'
import { fetchBySubmission } from '@repetition/core/code/Validators'
import { fetchResponse } from '@repetition/core/code/response/RunnerDTO'
import { not } from '@repetition/core/types'


const repository = new Repository()

const name = 'Code'

const eventBridge = new EventBridgeComponent()
type EventDetail = {
    user_id: string,
    submission_id: string,
    user_code: string,
    test_code: string

}
export const GET = apiHandler(get, {validator: fetchBySubmission})
export const POST = apiHandler(post)

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
        console.log('rerting 40000333')
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
        let body = await req.text()
        console.log("[ROUTE] Body: ",  body)


        let inputs = [[5, 12], [4, 2, 1]]
        let answers = [17, 7]
        let tests = 'const results = []; let response;';
        for (let i=0; i<inputs.length; i++) {
            tests += `
                const test${i} = new Solution();
                const answer${i} = test${i}.hasCycle(${inputs[i]});
                const correctAnswer${i} = ${answers[i]};
                response = {
                    pass: 'false',
                    expected: correctAnswer${i},
                    recieved: answer${i}
                };
                if (answer${i} === correctAnswer${i}) {
                    response.pass = 'true';
                } 
                results.push(response);
            `
        }
        tests += 'return results'
        const test_code = `
            (function() {
                ${tests}
            })()
        `

        const userId = ctx.user.id;
        const submissionId = randomNumbers();

        console.log('[ROUTE] triggering....')
        const trigger = await eventBridge.send<EventDetail>({
            user_id: userId,
            submission_id: submissionId,
            user_code: body.replace(/console\.log/g, "process.stdout.write"),
            test_code: test_code
        })


        console.log("[ROUTE] trigger", trigger)


        return submissionId

        // const result = await request.json()
        // console.log(result)
        // return result.result
        
    } catch (error) {
        console.log('in the error')
        logger.info(`[ERROR] [${name.toUpperCase()}_POST]`, error)
        return {
            error: 'Internal error',
        }
    }
}

import { HttpResponse, apiHandler } from '@/lib'
import { logger } from '@repetition/core/lib/logger'
import EventBridgeComponent from '@repetition/core/lib/aws/EventBridgeComponent'
import Repository from '@repetition/core/code/Repository'

const repository = new Repository()

const name = 'Code'

const eventBridge = new EventBridgeComponent()
type EventDetail = {
    user_id: string,
    submission_id: string,
    user_code: string,
    test_code: string

}
export const GET = apiHandler(get)
export const POST = apiHandler(post)

async function get(
    req: Request,
    {}: {},
    ctx:any
) {
    console.log('using the repository gto getcfh item')
    const item = await repository.fetchByUuid(ctx.user.identity + "_" + "122333")

    console.log('in the route', item)

    return item
}

async function post(
    req: Request,
    {}: {},
    ctx: any
) {
    try {
        let body = await req.text()
        console.log(body)


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
        const submissionId = '122333';

        console.log('triggering....')
        const trigger = await eventBridge.send<EventDetail>({
            user_id: userId,
            submission_id: submissionId,
            user_code: body,
            test_code: test_code
        })


        console.log("router trigger", trigger)


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

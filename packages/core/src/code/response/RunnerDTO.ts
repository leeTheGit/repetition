import { RunnerEntity } from '@repetition/core/code/RunnerEntity'



export const fetchResponse = (res: RunnerEntity) => {
    return {
        id: res.id,
        submittedAt: res.submittedAt,
        logs: res.logs,
        answers: res.answers,
    }
}


export type RunnerAPI = ReturnType<typeof fetchResponse>

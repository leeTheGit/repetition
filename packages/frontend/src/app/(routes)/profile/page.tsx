import Repository from '@repetition/core/user/Repository'
import { isError } from '@repetition/core/types'
import { UserForm as Form } from '@/components/pages/users/user-form'
import { getUserAuth } from '@repetition/frontend/lib/auth/utils'

const repository = new Repository()

const Page = async ({
    params,
}: {
    params: { entityId: string; storeId: string }
}) => {
    const auth = await getUserAuth()
    if (!auth.session) {
        return null
    }

    let isNew = false
    let entity = null

    if (params.entityId === 'new') {
        isNew = true
    }

    if (!isNew) {
        entity = await repository.fetchByUuid(auth.session.user.id)
        if (isError(entity)) {
            return <div>This user does not exist</div>
        }
    }

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <Form
                    initialData={entity ? entity.toObject() : null}
                />
            </div>
        </div>
    )
}

export default Page

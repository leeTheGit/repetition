import { NextRequest } from 'next/server'
import { urlParams, postParams } from '@repetition/core/asset/AssetValidators'
import { getUploadURL } from '@repetition/core/asset/actions/getPresignedUrl'
import { HttpResponse, apiHandler, getZodErrors } from '@/lib'
import OrganisationRepository from '@repetition/core/organisation/Repository'
import { isError } from '@repetition/core/types'

const organisationRepository = new OrganisationRepository()

export const GET = apiHandler(get, { validator: urlParams })

async function get(
    req: NextRequest,
    { params }: { params: { storeId: string } },
    ctx: any
) {
    const { searchParams } = new URL(req.url)
    const nameInput = searchParams.get('name')
    const typeInput = searchParams.get('type')

    let input = urlParams.safeParse({ name: nameInput, type: typeInput })
    if (!input.success) {
        return {
            error: getZodErrors(input),
            status: 400,
        }
    }

    // We want the integer id of the user's organisation to use in the path
    // of the asset for storing in S3
    const organisation = await organisationRepository.fetchByUuid(
        ctx.store.organisationUuid
    )
    if (isError(organisation)) {
        return organisation
    }

    const prefix = 'sites/o_' + organisation.id + '/s_' + ctx.store.id

    const { name, type } = input.data
    const signed = await getUploadURL(name, prefix, type)

    return {
        data: signed,
    }
}

// export async function POST(req: Request) {

//     let data, input;

//     const body = await req.json();

//     input = postParams.safeParse(data);

//     if (!input.success) {
//         // https://stackoverflow.com/questions/57438198/typescript-element-implicitly-has-an-any-type-because-expression-of-type-st
//         const errors:Record<string, any> = input.error.flatten().fieldErrors;
//         let errorString = "";
//         for (let error in errors) {
//             errorString += `${error}: ${errors[error]}\n`;
//         }
//         throw new Error(errorString);
//     }

//     const assetData = {
//         ...input.data,
//         userUuid: userId,
//     };

//     const results = await assetRepository.create(assetData);

//     return results;
// }

import UserRepository from '@repetition/core/user/Repository'
import AccountRepository from '@repetition/core/auth/account/Repository'
import { isError, ModelError } from '@repetition/core/types';
import { accountTypeEnum } from '@repetition/core/lib/db/schema/schema'

const userRepository = new UserRepository
const accountRepository = new AccountRepository
type AccountType = typeof accountTypeEnum[number]

export interface GitHubUser {
    id: string;
    login: string;
    avatar_url: string;
    email: string;
  }

export const CreateUserFromOauth = async (type: AccountType, githubUser: GitHubUser): Promise<{id: string} | ModelError>  => {
    let existingUser = null;

    if (githubUser.email) {
         existingUser = await userRepository.fetchByEmail(githubUser.email);
    }
    if (existingUser === null || isError(existingUser)) {
        
        existingUser = await userRepository.create({
            email: githubUser.email || `${githubUser.login}@no_email.com`,
            username: githubUser.login,
            firstname: null,
            organisationUuid: null,
            storeUuid: null,
            lastname: null,
            status: 'active',
            profileImage: null,
            isDeleted: false,
            emailVerified: null,
            image: null,
            isTwoFactorEnabled: false,
            rememberToken: null,
            data: null,
        })

        if (isError(existingUser) || !('uuid' in existingUser)) {
            return {
                error: 'Error creating user',
            }
        }
        
    }


    if (existingUser && !isError(existingUser)) {
        const accountData = {
            userId: existingUser.uuid,
            accountType: type,
            githubId:githubUser.id 
        }
        const createAccount = await accountRepository.create(accountData)

        if (isError(createAccount)) {
            console.log("error", createAccount)
            console.log('[ERROR] [GITHUB OAUTH] failed to create account')
        }

        return {
            id: existingUser.uuid
        }
    }
    return {
        error: "Error creating user account via github"
    }
}
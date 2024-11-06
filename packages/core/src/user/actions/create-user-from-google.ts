import UserRepository from '@repetition/core/user/Repository'
import AccountRepository from '@repetition/core/auth/account/Repository'
import { isError, ModelError } from '@repetition/core/types';
import { accountTypeEnum } from '@repetition/core/lib/db/schema/schema'
const userRepository = new UserRepository
const accountRepository = new AccountRepository

type AccountType = typeof accountTypeEnum[number]

export interface GoogleUser {
    sub: string;
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    locale: string;
  }


export const CreateUserFromGoogle = async (type: AccountType, googleUser: GoogleUser): Promise<{id: string} | ModelError>  => {

   let existingUser = await userRepository.fetchByEmail(googleUser.email);

   if (existingUser === null || isError(existingUser)) {
        
        existingUser = await userRepository.create({
            email: googleUser.email,
            username: googleUser.name,
            firstname: googleUser.given_name || "",
            organisationUuid: null,
            storeUuid: null,
            lastname: googleUser.family_name || "",
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
            googleId:googleUser.sub 
        }
        const createAccount = await accountRepository.create(accountData)

        if (isError(createAccount)) {
            console.log("error", createAccount)
            console.log('[ERROR] [GOOGLE OAUTH] failed to create account')
        }

        return {
            id: existingUser.uuid
        }
    }
    return {
        error: "Error creating user account via google"
    }
}
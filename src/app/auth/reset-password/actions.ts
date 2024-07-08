"use server";

import { validateRequest } from '@/lib/auth/validate'
import Repository from '@/core/auth/Repository'
import UserRepository from '@/core/user/Repository'
import { rateLimitByIp } from "@/lib/limiter";
import { isError } from '@/core/types';

interface ActionResult {
    error: string
}

const authRepository = new Repository
const userRepository = new UserRepository


// export async function ResetPasswordAction(
//   _: any,
//   formData: FormData

// ): Promise<ActionResult> {

    // const { session } = await validateRequest()
    // if (session) {
    //     return {
    //         error: 'You are currently logged in.  Go to user settings to reset password',
    //     }
    // }


    // const token = formData.get('token')
    // if (!token || typeof token !== 'string') {
    //     return {
    //       error: "Missing token"
    //     }
    // }

    // const password = formData.get('password')
    // if (!password || typeof password !== 'string') {
    //     return {
    //       error: "Missing password"
    //     }
    // }

    // const tokenEntry = await authRepository.getPasswordResetToken(token);
    // if (isError(tokenEntry)) {
    //     return {
    //         error: "Token not found"
    //     }
    // }
  
    // const userId = tokenEntry.identifier;
    // const user = await userRepository.fetchByUuid(userId)
    // if (isError(user)) {
    //     return {
    //         error: "User not found for password reset"
    //     }
    // }

    // console.log("[PASSWORD RESET]", user)

    // return {
    //     success: true
    // }
// }

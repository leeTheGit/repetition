import { Argon2id } from 'oslo/password'
// import { Scrypt } from "oslo/password";

export const passwordHash = async (password:string) => {
    return await new Argon2id().hash(password)
}


export const verify = async (hashedPassword:string, password: string) => {
    return await new Argon2id().verify(
        hashedPassword,
        password
    )
}
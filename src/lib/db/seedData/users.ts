import { passwordHash } from '@/lib/auth/hash'

// import { Scrypt } from "oslo/password";

const hashedPassword = async (password: string) => {
    // const scrypt = new Scrypt();
    // return await scrypt.hash(password);
    return await passwordHash(password);
}


const Users = async() => [
    {
        uuid: "5adfc196-3415-4251-b1d9-8c58ab8bb154",
        firstname: "tester",
        lastname: "able",
        username: "tester",
        hashedPassword: await hashedPassword("111111"),
        email: "test@test.com",
    },
    {
        uuid: "5adfc196-3415-4251-b1d9-8c58ab8bb153",
        firstname: "tester2",
        lastname: "able",
        username: "tester2",
        hashedPassword: await hashedPassword("222222"),
        email: "test2@test2.com",
    },
    {
        uuid: "5adfc196-3415-4251-b1d9-8c58ab8bb152",
        firstname: "tester3",
        lastname: "able",
        username: "tester3",
        hashedPassword: await hashedPassword("333333"),
        email: "test3@test3.com",
    }

];


export default Users;
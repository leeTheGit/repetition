import '@testing-library/jest-dom'
import { describe, it, expect, vi  } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react';
import { GlobalContextProvider} from '@/tests/globalContextProvider'
import userEvent from '@testing-library/user-event';
import { UserForm as Form } from '@/components/pages/users/user-form'

// import { usePathname, useRouter, useSearchParams } from "next/navigation"
// vi.mock("next/headers", () => {
//     return {
//         cookies: vi.fn( () => {
//             return { 
//                 get: vi.fn(),
//                 set: vi.fn()
//             }
//         }),
//     };
// });
vi.mock("next/navigation", () => {
    return {
        useSearchParams: vi.fn( () => {
            return { 
                get: vi.fn((param:string) => {
                    return param === 'sortby' ? "last_practiced" : "desc"
                }
            )}
        }),

        useRouter: vi.fn( () => {
            return { push: vi.fn()} 
        }),
        usePathname: vi.fn()
    };
});

describe('The profile page', () => {

    const user = {
        id: 16,
        uuid: '5adfc196-3415-4251-b1d9-8c58ab8bb154',
        organisationUuid: 'a808fcc3-1476-4a36-8df2-448110e40278',
        firstname: 'tester',
        lastname: 'able',
        username: 'tester',
        email: 'test@test.com',
        emailVerified: null,
        image: null,
        profileImageId: null,
        isTwoFactorEnabled: false,
        status: 'active',
        isDeleted: false,
        data: null,
        rememberToken: null,
        lastLoggedin: null,
        createdAt: "2024-08-25T06:46:14.002Z",
        updatedAt: "2024-08-25T06:46:14.012Z",
        profileImage: null
    }



    const renderProblemListing= async () => {

        render(
            <GlobalContextProvider>
                <Form initialData={user} onClose={() => {}} modal={false} />
            </GlobalContextProvider>
        )

        return {
            form: {
                get username() {
                  return screen.getByLabelText('Username')
                },
                get firstname() {
                   return screen.getByLabelText('First name') 
                }
            },
            username: screen.getByLabelText('Username'),
            firstname: screen.getByLabelText('First name'),
            lastname: screen.getByLabelText('Last name'),
            email: screen.getByLabelText('Email'),
            upload: screen.getByTestId('avatar-upload'),
            submit: screen.getByTestId('submit')
        }
    }


    it('Renders user form', async () => {
        const {username, firstname, lastname, email} = await renderProblemListing()
        expect( username ).toBeInTheDocument();
        expect (username).toHaveValue('tester')
        expect (firstname).toHaveValue('tester')
        expect (lastname).toHaveValue('able')
        expect (email).toHaveValue('test@test.com')
    })


    it('Updates the user form', async () => {
        const {username, firstname, lastname, email, form, submit} = await renderProblemListing()
        const fetchSpy = vi.spyOn(globalThis, "fetch");
        await userEvent.clear(username)
        await userEvent.clear(firstname)
        await userEvent.clear(lastname)
        await userEvent.clear(email)
        await userEvent.type(username, 'RadHomer');
        await userEvent.type(firstname, 'Homer');
        await userEvent.type(lastname, 'Simpson');
        await userEvent.type(email, 'homer@springfield.com');
        await userEvent.click(submit)

        await waitFor(async () => {

          expect(form.firstname).toHaveValue('Homer')
          expect(fetchSpy).toHaveBeenCalledWith(
            '/api/users/5adfc196-3415-4251-b1d9-8c58ab8bb154',
            expect.objectContaining({
                method: 'PATCH',
                body: JSON.stringify({
                    "firstname":"Homer",
                    "lastname":"Simpson",
                    "username":"RadHomer",
                    "email":"homer@springfield.com"
                })               ,
            }),
          )
    
        })
    })

})
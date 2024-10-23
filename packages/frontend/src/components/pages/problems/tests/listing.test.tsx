import '@testing-library/jest-dom'
import { describe, it, expect, vi  } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react';
import { GlobalContextProvider} from '@/tests/globalContextProvider'

import { Listing } from "@/components/pages/problems/listing";

// import { usePathname, useRouter, useSearchParams } from "next/navigation"

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


describe('The problems listing', () => {

    const renderProblemListing= async (course: string ) => {

        render(
            <GlobalContextProvider>
                <Listing courseId={course} />
            </GlobalContextProvider>
        )

        return {
            listing: await screen.findByTestId('problem-list'),
            getProblemNames() {
                return screen.getAllByTestId('problem-name').map((c) => {
                    return c.textContent
                })
                // return getAllByTestId('name').map((u) => u.textContent)
                // container.map((name) => name.textContent)
                // const {getAllByTestId} = within(container)
                // return getAllByTestId('name').map((u) => u.textContent)
            } 
        }
    }


    it('Renders problems list', async () => {
        const {listing, getProblemNames} = await renderProblemListing("b84bbb71-6e38-491d-91f2-61c464dd9c63")
        expect( listing ).toBeInTheDocument();
        await waitFor( async () => {
            expect(getProblemNames()).toEqual([
                'Valid Palindrome',
                'Number of Islands',
                'Invert Binary Tree',
                'String Encode and Decode'
              ])
            // screen.debug()

            // const nameContainer = await screen.findAllByTestId('problem-name')
            // expect(screen.getByText('The self-taught UI/UX designer roadmap (2021)')).toBeInTheDocument();
            // expect(screen.getByText('homarp')).toBeInTheDocument();
        });
        
        // const nameContainer = await screen.findByTestId('problem-name')
        // const {getByRole} = within(nameContainer)
        // const name = getByRole('link').textContent
        // console.log("@@@@@@@@@@@@@", name)
        // screen.debug()
    })

})
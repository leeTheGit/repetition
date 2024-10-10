import { http, HttpResponse } from 'msw'

import {categories} from './categories-data'
import {problems} from './problem-data'
import { Limelight } from 'next/font/google'

export const handlers = [

    http.get('/api/categories', () => {
        console.log('Captured a "GET /categories" request')
        return HttpResponse.json(categories)
    }),
    http.get('/api/courses/:id/problems', ({params, request}) => {
        console.log(params.id)
            // Construct a URL instance out of the intercepted request.
        const url = new URL(request.url)
 
        // Read the "id" URL query parameter using the "URLSearchParams" API.
        // Given "/product?id=1", "productId" will equal "1".
        const limit = url.searchParams.get('limit')
        console.log(limit)

        console.log(`Captured a "GET /api/courses/${params.id}/problems`)
        return HttpResponse.json(problems)
    }),
    http.get('/api/submission', () => {
        console.log('Captured a "GET /submissions" request')
        return HttpResponse.json([])
    }),

]

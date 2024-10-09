import { http, HttpResponse } from 'msw'

import {categories} from './categories-data'

export const handlers = [

    http.get('/api/categories', () => {
        console.log('Captured a "GET /categories" request')
        return HttpResponse.json(categories)
    }),
    http.get('/api/courses/b84bbb71-6e38-491d-91f2-61c464dd9c63/problems', () => {
        console.log('Captured a "GET /courses" request')
        return HttpResponse.json(categories)
    }),
    http.get('/api/submission', () => {
        console.log('Captured a "GET /submissions" request')
        return HttpResponse.json([])
    }),

]

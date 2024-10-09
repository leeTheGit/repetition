"use client"

import React from 'react'
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
// import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";

import {
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query'


export const TanstackQueryClient = ({ children }: React.PropsWithChildren) => {
    const [client] = React.useState(() => new QueryClient({
        defaultOptions: {
            queries: {
              staleTime: 60 * 1000,
              retry: false,
            },
          },
    }))

    return (
        <QueryClientProvider client={client}>
            {children}
        </QueryClientProvider>
    )
}


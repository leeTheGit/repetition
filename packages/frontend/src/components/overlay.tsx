import React from 'react'
import { cn } from '@repetition/core/lib/utils'

interface Props {
    children?: React.ReactNode
    className?: string
}

const Overlay = ({ className, children }: Props) => {
    return (
        <div
            className={cn(
                'z-10 fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center backdrop-blur-[2px]',
                className
            )}
        >
            {children}
        </div>
    )
}

export default Overlay

import React from 'react'

import { cn } from '@repetition/core/lib/utils'

interface Props {
    title: string
    description?: string
    className?: string
}

export const Heading: React.FC<Props> = ({
    title,
    description,
    className = '',
}) => {
    return (
        <div>
            <h2 className={cn(`text-2xl font-bold tracking-light`, className)}>
                {title}
            </h2>
            {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}
        </div>
    )
}

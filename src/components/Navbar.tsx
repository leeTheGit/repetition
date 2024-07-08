import React from 'react'

interface Props {
    children: React.ReactNode
}

const Navbar: React.FC<Props> = async ({ children }) => {
    return (
        <div className="sticky top-0 z-50 backdrop-blur-[8px] border-b dark:bg-black/60 bg-muted/50">
            <div className="flex h-16 items-center px-4 justify-between">
                {children}
            </div>
        </div>
    )
}

export default Navbar

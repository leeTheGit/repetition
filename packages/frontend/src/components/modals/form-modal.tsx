'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children?: React.ReactNode
    className?: string,
    escapeKey?: boolean
    pointerDownOutside?: boolean
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    className,
    escapeKey = true,
    pointerDownOutside = true
}) => {
    const onChange = (open: boolean) => {
        if (!open) {
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent 
                className={className}
                onEscapeKeyDown={(e)=>{
                    if (!escapeKey) e.preventDefault()
                }}
                onPointerDownOutside={(e)=> {
                    if (!pointerDownOutside) e.preventDefault()
                }}
                >
                {children}
            </DialogContent>
        </Dialog>
    )
}

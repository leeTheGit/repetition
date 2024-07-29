'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    children?: React.ReactNode
    className?: string
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    children,
    className,
}) => {
    const onChange = (open: boolean) => {
        if (!open) {
            onClose()
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onChange}>
            <DialogContent aria-describedby="foo" className={className}>{children}</DialogContent>
        </Dialog>
    )
}

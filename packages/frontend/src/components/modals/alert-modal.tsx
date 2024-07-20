'use client'

import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '../ui/button'

interface Props {
    children?: React.ReactNode
    isOpen: boolean
    title?: string
    message?: string
    onClose: () => void
    onConfirm: () => void
    confirmButtonLabel?: string
    loading: boolean
}

export const AlertModal: React.FC<Props> = ({
    children,
    isOpen,
    onClose,
    onConfirm,
    confirmButtonLabel = 'Delete',
    loading,
    title,
    message,
}) => {
    const [isMounted, setMounted] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    return (
        <Modal
            title={title || 'Quick question...'}
            description={message || ''}
            isOpen={isOpen}
            onClose={onClose}
            className=""
        >
            {children}
            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button disabled={loading} variant="outline" onClick={onClose}>
                    Cancel
                </Button>

                <Button
                    disabled={loading}
                    variant="destructive"
                    onClick={onConfirm}
                >
                    {confirmButtonLabel}
                </Button>
            </div>
        </Modal>
    )
}

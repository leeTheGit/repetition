'use client'

import { useEffect, useState } from 'react'
import { Modal } from '@/components/modals/form-modal'
import { CategoryForm as Form } from '@/components/pages/categories/category-form'
import { toast } from 'sonner'
import Overlay from '@/components/overlay'
import InlineSpinner from '@/components/spinners/InlineSpinner'

interface Props {
    isOpen: boolean
    courseId: string
    courseSlug: string
    onClose: () => void
    onConfirm: () => void
    entityId: string | null
}

const endpoint = 'categories'
const name = 'Category'

export const FormModal = ({
    isOpen,
    onClose,
    onConfirm,
    courseId,
    courseSlug,
    entityId,
}: Props) => {
    const [isMounted, setMounted] = useState(false)

    // const [entity, setEntity] = useState(null);
    const [entity, setEntity] = useState()


    const fetchCategory = async () => {
        if (!entityId) {
            return
        }

        try {
            const res = await fetch(`/api/courses/${courseId}/${endpoint}/${entityId}`)
            const data = await res.json()
            setEntity(data.data)
        } catch (error: any) {
            toast.error(
                `There was an error fetching the ${name.toLowerCase()} ` +
                    error.message
            )
        }
    }

    useEffect(() => {
        setMounted(true)
        if (isOpen && entityId) {
            fetchCategory()
        }
    }, [isOpen, entityId])

    if (!isMounted) {
        return null
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="">
            <div className="pt-6 space-x-2 flex flex-col justify-end w-full">
                {isOpen && (
                    <>
                        {entityId && !entity && (
                            <Overlay>
                                <InlineSpinner />
                            </Overlay>
                        )}
                        <Form
                            initialData={entity || null}
                            onClose={onClose}
                            modal={true}
                            courseSlug={courseSlug}
                            courseId={courseId}
                        />
                    </>
                )}
            </div>
        </Modal>
    )
}

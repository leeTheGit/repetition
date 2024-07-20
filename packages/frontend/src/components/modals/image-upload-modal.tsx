'use client'

import { useEffect, useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '../ui/button'
import { SingleImageDropzone } from '@/components/single-image-dropzone'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Overlay from '@/components/overlay'
import InlineSpinner from '@/components/spinners/InlineSpinner'

interface Props {
    isOpen: boolean
    message?: string
    onClose: () => void
    onConfirm: (file: File) => Promise<boolean>
    loading: boolean
}

export const ImageUploadModal: React.FC<Props> = ({
    isOpen,
    onClose,
    onConfirm,
    loading,
    message,
}) => {
    const [isMounted, setMounted] = useState(false)
    const [isLoading, setLoading] = useState(false)
    const [file, setFile] = useState<File>()
    const [fileInfo, setFileInfo] = useState<{
        size: number
        type: string
        height: number
        width: number
    }>()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!isMounted) {
        return null
    }

    const close = () => {
        setLoading(false)
        setFile(undefined)
        setFileInfo(undefined)
        onClose()
    }
    const submit = async (file: File) => {
        setLoading(true)
        const result = await onConfirm(file)
        if (result) {
            close()
        }
    }
    const loadingClass = loading ? 'opacity-50' : ''

    return (
        <Modal
            title="Image upload"
            description={message || 'Hi!'}
            isOpen={isOpen}
            onClose={onClose}
            className={`${loadingClass} w-[700px] max-w-[none] block min-h-[472px]`}
        >
            {isLoading && (
                <Overlay>
                    <InlineSpinner />
                </Overlay>
            )}
            <Tabs
                className="mt-5 w-full"
                defaultValue="upload"
                orientation="vertical"
            >
                <TabsList>
                    <TabsTrigger
                        value="upload"
                        className="data-[state=active]:bg-buttonactive"
                    >
                        Upload
                    </TabsTrigger>
                    <TabsTrigger
                        value="search"
                        className="data-[state=active]:bg-buttonactive"
                    >
                        Search Assets
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="search">
                    <h3>Coming soon</h3>
                </TabsContent>

                <TabsContent value="upload">
                    <div className="grid grid-cols-12 py-4 gap-8 ">
                        <div className="w-full  col-span-7 ">
                            <SingleImageDropzone
                                // width={200}
                                // height={200}
                                className="w-full h-[200px]"
                                value={file}
                                onChange={async (file) => {
                                    if (file) {
                                        const reader = new FileReader()

                                        reader.onload = (e) => {
                                            const img = new Image()

                                            img.onload = () => {
                                                const { width, height } = img
                                                setFileInfo({
                                                    size: file.size,
                                                    type: file.type,
                                                    width,
                                                    height,
                                                })
                                            }

                                            if (e.target?.result) {
                                                img.src = e.target
                                                    .result as string
                                            }
                                        }

                                        reader.readAsDataURL(file)

                                        setFile(file)
                                    } else {
                                        setFile(undefined)
                                        setFileInfo(undefined)
                                    }
                                }}
                            />
                        </div>
                        <div className="col-span-5">
                            <p className="text-sm text-gray-600">
                                {fileInfo && (
                                    <>
                                        <span>Size: {fileInfo.size} bytes</span>
                                        <br />
                                        <span>
                                            Dimensions: {fileInfo.width} x{' '}
                                            {fileInfo.height}
                                        </span>
                                        <br />
                                        <span>Type: {fileInfo.type}</span>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                        <Button
                            disabled={isLoading}
                            variant="outline"
                            onClick={close}
                        >
                            Cancel
                        </Button>

                        {file && (
                            <Button
                                disabled={loading}
                                variant="default"
                                onClick={() => submit(file)}
                            >
                                Upload
                            </Button>
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </Modal>
    )
}

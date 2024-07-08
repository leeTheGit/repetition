'use client'

import { Button } from '@/components/ui/button'
import { Image } from 'lucide-react'
import { useState } from 'react'
import useUploadToS3 from '@/hooks/upload-to-s3'
import { ImageUploadModal } from '@/components/modals/image-upload-modal'
import useAssetStore from '@/store/asset-slice'

interface Props {
    storeId: string
    entity?: string
    entityUuid?: string
}
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const UploadAsset = ({ storeId, entity, entityUuid }: Props) => {
    const [imageUploadModal, setUploadModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const { uploadAsset } = useUploadToS3()
    // const router = useRouter();

    const addAsset = useAssetStore((state) => state.addItem)

    return (
        <div>
            <Button
                disabled={loading}
                variant="default"
                size="default"
                className="mr-4"
                onClick={() => setUploadModal(true)}
            >
                <Image className="h-4 w-4" />
                <p className="ml-2">Upload image</p>
            </Button>

            <ImageUploadModal
                isOpen={imageUploadModal}
                message="Upload or search for assets"
                onClose={() => setUploadModal(false)}
                onConfirm={async (file) => {
                    const url = await uploadAsset(storeId, file, {
                        entity: entity,
                        entity_uuid: entityUuid,
                        type: 'banner',
                        assetType: 'image',
                    })
                    addAsset(url.asset)
                    return true
                }}
                loading={loading}
            />
        </div>
    )
}

export default UploadAsset

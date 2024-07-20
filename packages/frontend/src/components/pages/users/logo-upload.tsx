import { EntitySchema as AssetSchema } from '@repetition/core/asset/AssetValidators'
import Logo from './logo'
import { PlusSquare } from 'lucide-react'

interface Props {
    storeId: string
    logo: AssetSchema | null | undefined
    type: string
    onOpen: () => void
    onDelete: () => void
}

const LogoUpload = ({ storeId, logo, type, onOpen, onDelete }: Props) => {
    let className =
        'bg-muted dark:bg-black hover:bg-slate-200 dark:hover:bg-slate-900'
    if (type === 'reverse') {
        className =
            'dark:bg-[#f1f5f9] bg-[#434343] dark:hover:bg-slate-200 hover:bg-slate-900'
    }

    return (
        <>
            {!logo && (
                <div
                    onClick={onOpen}
                    className={`${className} h-[200px] w-[200px] border solid flex flex-col items-center justify-center hover:cursor-pointer `}
                >
                    <label
                        className={`mb-1 text-sm ${type === 'reverse' ? 'text-white dark:text-black' : 'text-black dark:text-white'} `}
                    >
                        {type === 'reverse'
                            ? 'Reverse Logo (Optional)'
                            : 'Logo'}
                    </label>
                    <PlusSquare className="text-gray-400 w-10 h-10" />
                </div>
            )}
            {logo && (
                <Logo
                    image={{
                        uuid: logo.uuid,
                        cdnUrl: logo.cdnUrl,
                        title: logo.title || '',
                        caption: logo.caption || '',
                        altText: logo.altText || '',
                    }}
                    storeId={storeId}
                    deleteHandler={onDelete}
                />
            )}
        </>
    )
}

export default LogoUpload

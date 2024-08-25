
import { X } from 'lucide-react'

interface Props {
    text:string
    handleDelete: (text:string) => void
}

export default function Tag({text, handleDelete}: Props)
{
    return (
        <span className="border-1 flex items-center' gap-x-1, rounded-2xl bg-gray-700 px-2 py-1">
            <span className="text-xs">{text}</span>
            {handleDelete && (
                <button
                    onClick={() => handleDelete(text)}
                    type="button"
                    className="text-gray-400 transition-colors hover:text-white relative pr-3 "
                    aria-label="Close">
                        <X className="absolute -top-[2px] -right-[3px]" height="12px" width="12px" />
                </button>
            )}
        </span>
    )
}
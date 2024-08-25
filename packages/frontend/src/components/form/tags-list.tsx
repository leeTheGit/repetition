import Tag from '@/components/form/tags'

interface Props {
    tags:string[]
    handleDelete: (text:string) => void
}

export default function TagsList({tags, handleDelete}: Props)
{
    console.log("in the list", tags)
    return (
        <div className="flex flex-wrap gap-x-2 gap-y-4">
            {tags?.map((tag, index) => (
               <Tag key={index} text={tag} handleDelete={handleDelete} />
            ))}
        </div>
    )
}
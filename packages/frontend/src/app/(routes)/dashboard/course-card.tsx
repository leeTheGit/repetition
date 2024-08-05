import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
import Image from 'next/image'
import Link from "next/link";
import {buttonVariants} from '@/components/ui/button'
import { cn } from "@repetition/frontend/lib/utils";
import { getUserAuth } from "@repetition/frontend/lib/auth/utils";
import { EntitySchema as AssetEntitySchema } from '@repetition/core/asset/AssetValidators'

import {EntitySchema} from '@repetition/core/course/Validators'

interface Props {
    course: EntitySchema & { courseImage?: AssetEntitySchema | null }
}

export const CourseCard = async ({ course }: Props ) => {
    const auth = await getUserAuth();
    
    return (
        <Card className="bg-muted dark:bg-[#161f33]">
            <CardHeader>
                <CardTitle>{course.name}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
                {course.courseImage && <Image
                    src={course.courseImage.cdnUrl}
                    alt={course.courseImage.title || "Course image"}
                    className=""
                    height={550}
                    width={550}
                />
                }
            </CardContent>
            <CardFooter className="flex flex-col">
                <Link className={cn(
                    buttonVariants({
                        variant: "default",
                    }),
                    "w-full"
                )} href={`/courses/${course.slug}/problems`}>Practice</Link>
                
                {course.userId === auth.session?.user.id && (
                    <Link className={cn(
                        buttonVariants({
                            variant: "default",
                        }),
                        "mt-5",
                        "w-full"
                    )} href={`/courses/${course.slug}/edit`}>Edit</Link>
                )}

            </CardFooter>
        </Card>
    )
}
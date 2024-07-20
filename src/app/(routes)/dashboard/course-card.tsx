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
import { cn } from "@/lib/utils";


import {EntitySchema} from '@/core/course/Validators'

interface Props {
    course: EntitySchema
}

export const CourseCard = ({ course }: Props ) => {

    return (
        <Card className="bg-muted dark:bg-[#161f33]">
            <CardHeader>
                <CardTitle>{course.name}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <Image
                    src="https://elcyen-prod-storeuploads-tezkaofv.s3.ap-southeast-2.amazonaws.com/platform/google-recaptcha.png"
                    alt="ReCAPTCHA logo"
                    className="invert"
                    height={550}
                    width={550}
                />
            </CardContent>
            <CardFooter>
                <Link className={cn(
                    buttonVariants({
                        variant: "default",
                    }),
                    "w-full"
                )} href={`/courses/${course.slug}/problems`}>Go</Link>
            </CardFooter>
        </Card>
    )
}
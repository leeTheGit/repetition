import React from "react";
import { Listing } from "@/components/pages/problems/listing";
import { not } from '@/core/types'
import CourseRepository from '@/core/course/Repository'
import { Suspense } from "react";
import { getUserAuth } from "@/lib/auth/utils";
import Overlay from "@/components/overlay";
import InlineSpinner from "@/components/spinners/InlineSpinner";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { CourseCard } from './course-card'

const courseRepository = new CourseRepository()


const Page = async ({ params }: { params: { storeId: string } }) => {
  const auth = await getUserAuth();
  if (!auth.session) {
    return null;
  }

    let courses = await courseRepository.fetchAll()
    if ( not(courses) ) {
      courses = []
    }

    return (
        <div className="flex-col">
            <div className="space-y-4 p-8 pt-6">
            <Suspense
                fallback={
                <div className="absolute top-0 left-0 h-screen w-full flex items-center justify-center">
                    <Overlay />
                    <InlineSpinner
                    className="z-20"
                    width="w-[50px]"
                    height="h-[50px]"
                    />
                </div>
                }
            >

                <div className="flex items-center justify-between">
                    <div>
                        <Heading
                            title={`Dashboard`}
                            description={`View courses`}
                        />
                    </div>

                    <Button >
                        <Plus className="mr-2 h-4 w-4" />
                        New Course
                    </Button>
                </div>

                <Separator />

                <div className=" w-full justify-center">
                    <div className="mt-10 flex flex-col m-auto max-w-[1200px]">

                        <h1 className="text-3xl">Shared courses</h1>

                        <div className="!mt-8 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                            {courses.map( courseEntity => { 
                                const course = courseEntity.toObject()
                                return <CourseCard course={course}/>

                            })}
                        </div>
                        
                        <Separator className="mt-10" />

                        <h1 className="mt-10 text-3xl">Your courses</h1>

                        <div className="!mt-8 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8"></div>

                    </div>
                </div>
            </Suspense>
            </div>
        </div>
    );
};

export default Page;

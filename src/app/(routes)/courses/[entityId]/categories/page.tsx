import React from "react";
import { Listing } from "@/components/pages/categories/listing";
import { Suspense } from "react";
import { getUserAuth } from "@/lib/auth/utils";
import Overlay from "@/components/overlay";
import InlineSpinner from "@/components/spinners/InlineSpinner";
import { uuidRegex } from '@/lib'
import CourseRepository from '@/core/course/Repository'
import { isError } from "@/core/types";

const Page = async ({ params }: { params: { entityId: string } }) => {
  const auth = await getUserAuth();
  if (!auth.session) {
    return null;
  }

  let courseId = params.entityId

  if (!courseId.match(uuidRegex)) {
      const courseRepository = new CourseRepository()
      const course = await courseRepository.fetchByUuid(params.entityId)
      if (isError(course)) {
          return <div>This page does not exist</div>
      }
      courseId = course.uuid
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
          <Listing 
            courseId={courseId} 
            courseSlug={params.entityId}
            />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;

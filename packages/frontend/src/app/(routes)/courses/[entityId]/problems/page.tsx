import React from "react";
import { Listing } from "@/components/pages/problems/listing";
import { Suspense } from "react";
import { getUserAuth } from "@repetition/frontend/lib/auth/utils";
import Overlay from "@/components/overlay";
import InlineSpinner from "@/components/spinners/InlineSpinner";
import CourseRepository from '@repetition/core/course/Repository'
import { not } from "@repetition/core/types";


const courseRepository = new CourseRepository()


const Page = async ({ params }: { params: { entityId: string } }) => {
  const auth = await getUserAuth();
  if (!auth.session) {
    return null;
  }

    // const course = await courseRepository.fetchByUuid(params.entityId)
    // if (not(course)) {
    //     return <div>This page does not exist</div>
    // }


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
          <Listing courseId={params.entityId} />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;

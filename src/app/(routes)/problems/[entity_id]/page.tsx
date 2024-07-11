import React from 'react'
import { Suspense } from "react";
import { getUserAuth } from "@/lib/auth/utils";
import Overlay from "@/components/overlay";
import InlineSpinner from "@/components/spinners/InlineSpinner";

const Page = async ({ params }: { params: { storeId: string } }) => {
  const auth = await getUserAuth();
  
  if (!auth.session) {
    return null;
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
            <div>on the problem bpage</div>

        </Suspense>
      </div>
    </div>
  );
};

export default Page;



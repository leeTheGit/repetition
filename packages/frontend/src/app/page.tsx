import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import Image from 'next/image'

export default function Component() {


 


  return (
    <div className="flex flex-col min-h-[100dvh]">
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Learn / Practice <br />Rinse / Repeat
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Build a study guide for any complex topic, then we&apos;ll help you learn with with spaced repetition until it sinks in.
                  </p>
                  <p className="text-xl text-white ">Rinse/Repeat</p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    href="/dashboard"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                    prefetch={false}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
              <Image
                src="/images/wireframe.png"
                width="350"
                height="410"
                alt="Hero"
                className="mx-auto blend-exclusion overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

            <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-800  dark:bg-gray-100">
                <div className="container px-4 md:px-6">
                    <div className="grid grid-cols-[400px_1fr] lg:gap-12 xl:grid-cols-[500px_1fr]">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <Image
                                alt="Hero"
                                className="flip-horizontally h-[300px] w-[300px] lg:h-full lg:w-full mx-auto overflow-hidden rounded-xl object-bottom lg:order-last aspect-square"
                                height={550}
                                src="https://elcyen-prod-storeuploads-tezkaofv.s3.ap-southeast-2.amazonaws.com/platform/needle_thread.png"
                                width={550}
                            />
                        </div>

                        <div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl dark:text-grey-300 text-black">
                                    Off with it&apos;s head!
                                </h2>
                                <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-800">
                                    A headless CMS gives you the freedom .
                                </p>
                            </div>

                            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    <div className="space-y-2 text-center">
                                        <h3 className="text-xl font-bold text-black">
                                            Blazing Fast
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-800">
                                            Our platform is optimized for
                                            lightning-fast page loads and
                                            seamless user experiences.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col items-center justify-center space-y-4">
                                    <div className="space-y-2 text-center">
                                        <h3 className="text-xl font-bold">
                                            Highly Customizable
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            Tailor your store to your brand with
                                            our flexible and user-friendly
                                            design tools.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center justify-center space-y-4">
                                    <div className="space-y-2 text-center">
                                        <h3 className="text-xl font-bold">
                                            Seamless Checkout
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            Provide your customers with a
                                            frictionless checkout experience to
                                            boost conversions.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> 

            <section className="w-full py-12 md:py-24 lg:py-32 border-t">
                <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6 lg:gap-10">
                <div className="space-y-3">
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Customers Say</h2>
                    <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                    Hear from the businesses that have found success with our ecommerce solutions.
                    </p>
                </div>
                <div className="divide-y rounded-lg border">
                    <div className="grid w-full grid-cols-3 items-stretch justify-center divide-x md:grid-cols-3">
                    <div className="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
                        <img
                        alt="Logo"
                        className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                        height={70}
                        src="/placeholder.svg"
                        width={140}
                        />
                    </div>
                    <div className="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
                        <img
                        alt="Logo"
                        className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                        height={70}
                        src="/placeholder.svg"
                        width={140}
                        />
                    </div>
                    <div className="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
                        <img
                        alt="Logo"
                        className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                        height={70}
                        src="/placeholder.svg"
                        width={140}
                        />
                    </div>
                    </div>
                    <div className="grid w-full grid-cols-3 items-stretch justify-center divide-x md:grid-cols-3">
                    <div className="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
                        <img
                        alt="Logo"
                        className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                        height={70}
                        src="/placeholder.svg"
                        width={140}
                        />
                    </div>
                    <div className="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
                        <img
                        alt="Logo"
                        className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                        height={70}
                        src="/placeholder.svg"
                        width={140}
                        />
                    </div>
                    <div className="mx-auto flex w-full items-center justify-center p-4 sm:p-8">
                        <img
                        alt="Logo"
                        className="aspect-[2/1] overflow-hidden rounded-lg object-contain object-center"
                        height={70}
                        src="/placeholder.svg"
                        width={140}
                        />
                    </div>
                    </div>
                </div>
                </div>
            </section>


      </main>
    </div>
  )
}



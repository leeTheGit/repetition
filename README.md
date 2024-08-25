# SST (Serverless Stack) Application (https://sst.dev/guide.html)

This repository contains a Serverless Stack (SST) application that utilizes AWS Lambda, DynamoDB and Event Bridge.

This is a Typescript application that uses:
  [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
  [PNPM](https://pnpm.io/) for dependency management and monorepo
  [Zod](https://zod.dev/) for input validation
  [Drizzle](https://orm.drizzle.team/) for Database ORM
  [React Hook Forms](https://react-hook-form.com/) With Zod for typesafe validated form
  [Lucia Auth](https://lucia-auth.com/getting-started/) For api token, credential and Oauth authentication
  [AWS CDK](https://aws.amazon.com/cdk/) For infrastructure
  [SST](https://sst.dev/) with OpenNext to run Next.js directly on AWS

## Prerequisites

Before running the application, make sure you have the following prerequisites installed on your machine:
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Docker](https://www.docker.com/)
- [PNPM](https://pnpm.io/installation) 

# Optional
- [AWS CLI](https://aws.amazon.com/cli/) configured with the necessary permissions
- AWS user with programatic access


## Getting Started
From the root directory:
- Run `docker compose up -D` to launch dev Postgres database
- Copy packages/frontend/env.example to packages/frontend/.env
- Copy packages/core/env.example to packages/core/.env

- Run `pnpm install` to install all dependencies for each package
- Run `pnpm migrate` to run Drizzle migrations
- Run `pnpm db:seed` to add dev users and starting data
- Run `pnpm dev` to get going

Open [http://localtest.me:3000](http://localtest.me:3000) with your browser to see the result.


Log in with:
    user: test@test.com
    pass: 111111 

Now click around.

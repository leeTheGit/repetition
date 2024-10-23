import { Hono } from 'hono'
import { handle } from 'hono/vercel'

import { route as problems } from '../routes/problems'
// import { routes as categories} from '../routes/categories'
// import { routes as code } from '../routes/code'
// import { routes as courses } from '../routes/courses.ts'
// import { routes as submission } from '../routes/submission'
// import { route as users } from '../routes/users'

// export const runtime = 'edge'

const app = new Hono().basePath('/rest')

app.route('/problems', problems)
// app.route('/code', code)
// app.route('/categories', categories)
// app.route('/courses', courses)
// app.route('/submission', submission)
// app.route('/users', users)

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
export const PATCH = handle(app)
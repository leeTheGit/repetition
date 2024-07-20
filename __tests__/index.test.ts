import { expect, it, beforeAll, describe } from "vitest";
// import {Slugify} from '@/lib/utils'
// import { PgUpdateBuilder } from "drizzle-orm/pg-core";


export type ApiResponse = {
  status: "success" | "error"
  data: any,
  error?: string
}


const headers = new Headers();
const ApiUrl = "http://localtest.me:3000/api";

beforeAll(async () => {
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer 14399d64-8718-46f8-ad15-15e7afe5d995');
})

const testOrganistation =''


const testCourses = [
  {
    name: "zzxxzztest-Cajun Cooking",
    description: 'Study recipes from West Africa, France and Spain',
  },
  {
    name: "zzxxzztest-Musical Scales",
    description: 'Practice scales on guitar',
  }
]

const testCategories = [
    {
      name: "zzxxzztest-Breakfasts",
      description: 'Strictly to be eaten before midday',
    },
  ]


const testProblem = {
    "name": "zzxxzztest Gumbo",
    "description": "Secrets to a delicious Gumbo",
    "difficulty": 3,
    "starter_code": "3 Cups of Gumbo",
    "link": "http://www.problemexample.com"
}

type Resource = {uuid: string, slug: string}[]
const courses: Resource = []
const problems: Resource = []
const categories: Resource = []




describe("It handles all course  operations", () => {
    it("Creates a new course", async () => {
        const url = `${ApiUrl}/courses`
        console.log(url)
        const req = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(testCourses[0])
        });
    
    
        const Response = await req.json() as ApiResponse;
        expect(req.status).toEqual(201);
    
        courses.push( {uuid: Response.data.uuid, slug: Response.data.slug} );
    });
   
    it("Fetch a list of courses", async () => {
        const req = await fetch(`${ApiUrl}/courses?limit=1`, {
            method: 'GET',
            headers,
        });
    
        const list = await req.json() as ApiResponse;
        expect( list.data.length ).toBeGreaterThan(0);
        expect( list.data[0].name).toEqual('zzxxzztest-Cajun Cooking')
        expect( list.data[0].slug).toEqual('zzxxzztest-cajun-cooking')
        expect( list.data[0].description).toEqual('Study recipes from West Africa, France and Spain')
    });
      
    
    
    
    it("Fetch by id", async () => {
        const req = await fetch(`${ApiUrl}/courses/${courses[0].uuid}`, {
            method: 'GET',
            headers,
        });
    
        const entity = await req.json() as ApiResponse;
        expect( entity.data.name ).toEqual('zzxxzztest-Cajun Cooking');
    })
    
    
    it("Fetch by slug", async () => {
        const req = await fetch(`${ApiUrl}/courses/${courses[0].slug}`, {
            method: 'GET',
            headers,
        });
    
        const entity = await req.json() as ApiResponse;
        expect( entity.data.name ).toEqual('zzxxzztest-Cajun Cooking');
    })
    
    it("Perform an update", async () => {
    
        const updated = {name: "zzxxzztest-Cajun Cooking updated", description: "Updated description text"}
      
        const req = await fetch(`${ApiUrl}/courses/${courses[0].uuid}`, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(updated)
        });
      
        expect(req.status).toEqual(200);
     
    });
    
    it("Fetches an updated course", async () => {
        const req = await fetch(`${ApiUrl}/courses/${courses[0].uuid}`, {
            method: 'GET',
            headers,
        });
    
        const entity = await req.json() as ApiResponse;
        expect( entity.data.name ).toEqual('zzxxzztest-Cajun Cooking updated');
        expect( entity.data.slug ).toEqual('zzxxzztest-cajun-cooking');
        expect( entity.data.description ).toEqual('Updated description text');
    })

})











describe("It handles all problem operations", () => {
    it("Creates a course problem", async () => {

        const newValues = {...testProblem, courseId: courses[0].uuid}
      
        const req = await fetch(`${ApiUrl}/courses/${courses[0].uuid}/problems`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(newValues)
        });
      
        const Response = await req.json() as ApiResponse;
      
        expect(req.status).toEqual(201);
      
        problems.push({uuid: Response.data.uuid, slug: Response.data.slug})
      
    });
      
      
      
      
    it("Fetch by id", async () => {
        // console.log(`${ApiUrl}/courses/${courses[0].uuid}/problems/${problems[0].uuid}`)
        const req = await fetch(`${ApiUrl}/courses/${courses[0].uuid}/problems/${problems[0].uuid}`, {
            method: 'GET',
            headers,
        });
    
        const entity = await req.json() as ApiResponse;
        expect( entity.data.slug ).toEqual('zzxxzztest-gumbo');
    })
      
    it("Fetch by slug", async () => {
        const req = await fetch(`${ApiUrl}/courses/${courses[0].uuid}/problems/${problems[0].slug}`, {
            method: 'GET',
            headers,
        });
    
        const entity = await req.json() as ApiResponse;
        expect( entity.data.slug ).toEqual('zzxxzztest-gumbo');
    })
      
      
    it("Updates a problem", async () => {
    
        const newValues = {...testProblem, courseId: courses[0].uuid, description: "Updated description text"}
    
        const req = await fetch(`${ApiUrl}/courses/${courses[0].uuid}/problems/${problems[0].uuid}`, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(newValues)
        });
    
        expect(req.status).toEqual(200);
    
    });
      
      
    it("Fetches an updated problem", async () => {
        const req = await fetch(`${ApiUrl}/courses/${courses[0].uuid}/problems/${problems[0].uuid}`, {
            method: 'GET',
            headers,
        });
    
        const entity = await req.json() as ApiResponse;
        expect( entity.data.slug ).toEqual('zzxxzztest-gumbo');
        expect( entity.data.description ).toEqual('Updated description text');
    })
})














describe("It handles all category operations", () => {

    it("Creates a category", async () => {

        const newValues = {...testCategories[0], courseId: courses[0].uuid}
      
        const req = await fetch(`${ApiUrl}/courses/${courses[0].uuid}/categories`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(newValues)
        });
      
        const Response = await req.json() as ApiResponse;
      
        expect(req.status).toEqual(201);
      
        categories.push({uuid: Response.data.uuid, slug: Response.data.slug})
      
    });
      
      
      
      
    it("Fetch by id", async () => {
        // console.log(`${ApiUrl}/courses/${courses[0].uuid}/problems/${problems[0].uuid}`)
        const req = await fetch(`${ApiUrl}/courses/${courses[0].uuid}/categories/${categories[0].uuid}`, {
            method: 'GET',
            headers,
        });
    
        const entity = await req.json() as ApiResponse;
        expect( entity.data.slug ).toEqual('zzxxzztest-breakfasts');
    })
      
    it("Fetch by slug", async () => {
        const req = await fetch(`${ApiUrl}/courses/${courses[0].uuid}/categories/${categories[0].slug}`, {
            method: 'GET',
            headers,
        });
    
        const entity = await req.json() as ApiResponse;
        expect( entity.data.slug ).toEqual('zzxxzztest-breakfasts');
    })
      
      
    it("Perform an update", async () => {
        const newValues = {courseId: courses[0].uuid, name:"Category name updated", description: "Updated description text"}
    
        const req = await fetch(`${ApiUrl}/courses/${courses[0].uuid}/categories/${categories[0].uuid}`, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(newValues)
        });
    
        expect(req.status).toEqual(200);
    });
      
      
    it("Fetches an update", async () => {
        const req = await fetch(`${ApiUrl}/courses/${courses[0].uuid}/categories/${categories[0].uuid}`, {
            method: 'GET',
            headers,
        });
    
        const entity = await req.json() as ApiResponse;
        expect( entity.data.slug ).toEqual('zzxxzztest-breakfasts');
        expect( entity.data.name ).toEqual('Category name updated');
        expect( entity.data.description ).toEqual('Updated description text');
    })

})
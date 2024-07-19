import { expect, it, beforeAll } from "vitest";
import {Slugify} from '@/lib/utils'


export type ApiResponse = {
  status: "success" | "error"
  data: any,
  error?: string
}


const headers = new Headers();
const ApiUrl = "http://localtest.me:3000/api";

beforeAll(async () => {
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', 'Bearer 6d17e1e9-fea2-4bc3-8748-ee48b81e02e6');
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

const testProblem = {
    "name": "zzxxzztest Gumbo",
    "description": "Secrets to a delicious Gumbo",
    "difficulty": 3,
    "starter_code": "3 Cups of Gumbo",
    "link": "http://www.problemexample.com"
}


const courses: {uuid: string, slug:string}[] = []
const problems: {uuid: string, slug:string}[] = []



it("Creates a new course", async () => {
    const req = await fetch(`${ApiUrl}/courses`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(testCourses[0])
    });


    const Response = await req.json() as ApiResponse;
    expect(req.status).toEqual(201);

    courses.push( {uuid: Response.data.uuid, slug: Response.data.slug} );
});



it("Creates a course problem", async () => {

  const newProblem = {...testProblem, courseId: courses[0].uuid}

  const problemreq = await fetch(`${ApiUrl}/courses/${courses[0].uuid}/problems`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(newProblem)
  });

  const problemResponse = await problemreq.json() as ApiResponse;

  expect(problemreq.status).toEqual(201);

  problems.push({uuid: problemResponse.data.uuid, slug: problemResponse.data.slug})

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
  



it("Fetch a course by id", async () => {
    const req = await fetch(`${ApiUrl}/courses/${courses[0].uuid}`, {
        method: 'GET',
        headers,
    });

    const entity = await req.json() as ApiResponse;
    expect( entity.data.name ).toEqual('zzxxzztest-Cajun Cooking');
})

it("Fetch a course by slug", async () => {
    const req = await fetch(`${ApiUrl}/courses/${courses[0].slug}`, {
        method: 'GET',
        headers,
    });

    const entity = await req.json() as ApiResponse;
    expect( entity.data.name ).toEqual('zzxxzztest-Cajun Cooking');
})


it("Fetch a problem by id", async () => {
    // console.log(`${ApiUrl}/courses/${courses[0].uuid}/problems/${problems[0].uuid}`)
    const req = await fetch(`${ApiUrl}/courses/${courses[0].uuid}/problems/${problems[0].uuid}`, {
        method: 'GET',
        headers,
    });

    const entity = await req.json() as ApiResponse;
    expect( entity.data.slug ).toEqual('zzxxzztest-gumbo');
})

it("Fetch a problem by slug", async () => {
    const req = await fetch(`${ApiUrl}/courses/${courses[0].uuid}/problems/${problems[0].slug}`, {
        method: 'GET',
        headers,
    });

    const entity = await req.json() as ApiResponse;
    expect( entity.data.slug ).toEqual('zzxxzztest-gumbo');
})


it("Updates a problem", async () => {

    const newProblem = {...testProblem, courseId: courses[0].uuid, description: "Updated description text"}
  
    const problemreq = await fetch(`${ApiUrl}/courses/${courses[0].uuid}/problems/${problems[0].uuid}`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify(newProblem)
    });
  
    expect(problemreq.status).toEqual(200);
 
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

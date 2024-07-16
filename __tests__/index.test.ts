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

const course = '2a2a6b0d-74ab-424f-827d-c390d5d759e5'

const testCourse = {
  name: "Cajun Cooking",
  slug: Slugify('Cajun Cooking'),
  description: 'Study recipes from West Africa, France and Spain',
}

const testProblem = {
    "name": "Gumbo",
    "description": "Secrets to a delicious Gumbo",
    "slug": "Gumbo",
    "difficulty": 3,
    "starter_code": "3 Cups of Gumbo",
    "link": "http://www.problemexample.com"
}




it("Creates a new course", async () => {
    const req = await fetch(`${ApiUrl}/courses`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(testCourse)
    });


    const Response = await req.json() as ApiResponse;
    const CourseUuid = Response.data.uuid;

    const newProblem = {...testProblem, testOrganistation}

    const problemreq = await fetch(`${ApiUrl}/courses/${CourseUuid}/problems`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(newProblem)
    });


    const problemResponse = await problemreq.json() as ApiResponse;

    // console.log("URL", ApiUrl);
    console.log(problemResponse);

    expect(req.status).toEqual(201);
    // expect(bodyResponse.data.problem.name).toEqual(programResponse.data.name);
});




it("Fetch a list of courses", async () => {

    const req = await fetch(`${ApiUrl}/courses?limit=1`, {
        method: 'GET',
        headers,
    });

    const list = await req.json() as ApiResponse;
    expect( list.data.length ).toBeGreaterThan(0);
    expect( list.data[0].name).toEqual('Cajun Cooking')
    expect( list.data[0].slug).toEqual('cajun-cooking')
    expect( list.data[0].description).toEqual('Study recipes from West Africa, France and Spain')
  });
  



import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import sluggish from "slugify";
import { v4 as uuidv4 } from "uuid";
import { QueryClient } from "@tanstack/query-core";
import { cache } from "react";


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getZodErrors = (input: any): string => {
  // https://stackoverflow.com/questions/57438198/typescript-element-implicitly-has-an-any-type-because-expression-of-type-st
  const errors: Record<string, any> = input.error.flatten().fieldErrors;
  let errorString = "";
  for (let error in errors) {
    errorString += `${error}: ${errors[error]}\n`;
  }
  return errorString.trim();
};
export function mapResult<Entity, M extends (item: any) => Entity>(
  result: any,
  mapToEntity: M,
): Entity[] {
  const Entities: Entity[] = [];
  for (let res of result) {
    try {
      const entity = mapToEntity(res);
      Entities.push(entity);
    } catch(e) {
      console.log(e)
    }
  }
  return Entities;
}

export const Slugify = (input: string) => {
  return sluggish(input, { strict: true, lower: true });
};

export const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;


export function randomNumbers(length: number = 10) {
    let result = "";
    const characters = "0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

export function createUuid() {
  return uuidv4();
}


let getQueryClient: () => QueryClient;
if (process.env.NODE_ENV === "production") {
  getQueryClient = cache(() => new QueryClient());
} else {
  getQueryClient = () => new QueryClient();
}
export default getQueryClient;
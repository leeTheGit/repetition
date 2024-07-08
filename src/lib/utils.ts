import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import sluggish from "slugify";
import winston from "winston";
import { v4 as uuidv4 } from "uuid";

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
    const entity = mapToEntity(res);
    Entities.push(entity);
  }

  return Entities;
}

export const Slugify = (input: string) => {
  return sluggish(input, { strict: true, lower: true });
};

export const uuidRegex =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;


export function createUuid() {
  return uuidv4();
}

import { QueryClient } from "@tanstack/query-core";
import { cache } from "react";

let getQueryClient: () => QueryClient;
if (process.env.NODE_ENV === "production") {
  getQueryClient = cache(() => new QueryClient());
} else {
  getQueryClient = () => new QueryClient();
}
export default getQueryClient;
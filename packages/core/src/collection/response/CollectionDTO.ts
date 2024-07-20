import { CollectionEntity } from "@repetition/core/collections/Entity";
import { WithoutNullableKeys } from "@repetition/core/types";

export const createResponse = (res: CollectionEntity) => {
  return {
    id: res.id,
    uuid: res.uuid,
    lable: res.name,
    createdAt: res.createdAt,
  };
};

export const fetchResponse = (res: CollectionEntity) => {
  return {
    id: res.id,
    uuid: res.uuid,
    name: res.name,
    slug: res.slug,
    description: res.description,
    createdAt: res.createdAt,
  };
};

export type CollectionAPI = ReturnType<typeof fetchResponse>;
export type CollectionAPIForm = WithoutNullableKeys<
  ReturnType<typeof fetchResponse>
>;

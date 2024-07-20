import { SubmissionEntity } from "@repetition/core/submission/Entity";
import { WithoutNullableKeys } from "@repetition/core/types";

export const createResponse = (res: SubmissionEntity) => {
  return {
    id: res.id,
    uuid: res.uuid,
 
    createdAt: res.createdAt,
  };
};

export const fetchResponse = (res: SubmissionEntity) => {
  return {
    id: res.id,
    uuid: res.uuid,
    grade: res.grade,
    node: res.note,
    solution: res.solution,
    createdAt: res.createdAt,
  };
};

export type SubmissionAPI = ReturnType<typeof fetchResponse>;
export type SubmissionAPIForm = WithoutNullableKeys<
  ReturnType<typeof fetchResponse>
>;

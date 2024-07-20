import { Entity } from "@repetition/core/baseEntity";
import { entitySchema, EntitySchema } from "./Validators";
import { getZodErrors, randomNumbers } from "@repetition/core/lib/utils";
import { ModelError } from "../types";

export class CategoryEntity extends Entity<EntitySchema> {
  private relations: { } = {};

  constructor(props: EntitySchema, id?: string) {
    super(props, id);
  }

  toObject(): EntitySchema {
    return {
      ...this.props,
    };
  }

  static fromValues(
    values: EntitySchema,
    id?: string,
  ): CategoryEntity | ModelError {
    const data = entitySchema.safeParse(values);
    if (!data.success) {
      return { error: getZodErrors(data) };
    }

    const entity = new CategoryEntity(data.data, id);

    return entity;
  }

  get id() {
    return this.props.id;
  }

  get uuid() {
    return this.props.uuid;
  }

  get name() {
    return this.props.name;
  }

  get slug() {
    return this.props.slug;
  }

  get description() {
    return this.props.description;
  }


  get courseId () {
    return this.props.courseId
  }

  /**
   * The repository class will run this recursively, adding
   * another random digit each time until slug is unique
   */
  uniqueSlug() {
    this.props.slug = this.props.slug + randomNumbers(1);
  }

  get createdAt() {
    return this.props.createdAt;
  }

}

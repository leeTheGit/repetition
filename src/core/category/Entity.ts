import { Entity } from "@/core/baseEntity";
import { entitySchema, EntitySchema } from "./Validators";
import { BillboardEntity } from "@/core/billboard/Entity";
import { getZodErrors, randomNumbers } from "@/lib/utils";
import { ModelError } from "../types";

export class CategoryEntity extends Entity<EntitySchema> {
  private relations: { billboard?: BillboardEntity } = {};

  constructor(props: EntitySchema, id?: string) {
    super(props, id);
  }

  toObject(): EntitySchema {
    // const billboard = {billboard : this.relations.billboard?.toObject()};
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

  get parentId() {
    return this.props.parentId;
  }
  get storeUuid() {
    return this.props.storeUuid;
  }

  get billboardUuid() {
    return this.props.billboardUuid;
  }

  get name() {
    return this.props.name;
  }

  get slug() {
    return this.props.slug;
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

  get billboardLabel() {
    return this.relations.billboard?.label || "";
  }

  get billboard(): BillboardEntity | null {
    return this.relations.billboard || null;
  }

  set billboard(billboard: BillboardEntity) {
    this.relations.billboard = billboard;
  }
}

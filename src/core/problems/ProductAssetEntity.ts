import { Entity } from "@/core/baseEntity";
import {
  productAssetSchema as entitySchema,
  ProductAssetSchema as EntitySchema,
} from "./Validators";
import { getZodErrors } from "@/lib/utils";
import { ModelError } from "../types";

export class ProductAssetEntity extends Entity<EntitySchema> {
  constructor(props: EntitySchema, id?: string) {
    super(props, id);
  }

  toObject(): EntitySchema {
    return { ...this.props };
  }

  static fromValues(
    values: EntitySchema,
    id?: string,
  ): ProductAssetEntity | ModelError {
    const data = entitySchema.safeParse(values);

    if (!data.success) {
      return { error: getZodErrors(data) };
    }

    const ProgramEntity = new ProductAssetEntity(data.data, id);

    return ProgramEntity;
  }

  get storeUuid() {
    return this.props.storeUuid;
  }

  get mediaUuid() {
    return this.props.mediaUuid;
  }

  get order() {
    return this.props.order;
  }

  // getImageUuid() {
  //     return this.props.imageUuid;
  // }
  // getImageUrl() {
  //     return this.props.imageUrl;
  // }
}

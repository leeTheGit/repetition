export type ModelError = {
    error: string
    status?: number
}

export function isError(error: any): error is ModelError {
    if (error === null) {
        return true
    }
    return error.error !== undefined
}

export const not = isError

export type NoUndefinedField<T> = {
    [Key in keyof T]-?: NoUndefinedField<NonNullable<T[Key]>>
}
// export type NoUndefinedField1<T> = { [P in keyof T]-?: NonNullable<T[P]> };
// export type NoUndefinedField2<T> = { [P in keyof T]-?: NoUndefinedField<T[P]> };
export type WithoutNullableKeys<T> = {
    [Key in keyof T]-?: WithoutNullableKeys<NonNullable<T[Key]>>
}

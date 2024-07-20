export const Delete = async (url: string) => {
  try {
    const del = await fetch(`/api/${url}`, {
      method: "DELETE",
    });
    if (!del.ok) {
      const errorMessage = await del.json();
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    throw new Error(error);
  }
};

export const create = async <Schema>(
  data: Schema,
  method: string,
  endpoint: string,
) => {
  try {
    const save = await fetch(`/api/${endpoint}`, {
      method,
      body: JSON.stringify(data),
    });

    if (!save.ok) {
      throw new Error(`Failed to save`);
    }
    return await save.json();
  } catch (error: any) {
    throw new Error(error.statusText);
  }
};

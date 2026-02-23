export interface IRepository<
  T,
  CreateDto = Partial<T>,
  UpdateDto = Partial<T>,
  Args extends any[] = [],
> {
  create(item: CreateDto, ...args: Args): Promise<T>;
  update(id: string, item: UpdateDto, ...args: Args): Promise<T>;
  delete(id: string, ...args: Args): Promise<T>;
  findAll(...args: Args): Promise<T[]>;
  findById(id: string, ...args: Args): Promise<T | null>;
}

export interface IRepository<T, CreateDto = any, UpdateDto = any> {
  create(item: CreateDto): Promise<T>;
  update(id: string, item: UpdateDto): Promise<T>;
  delete(id: string): Promise<T>;
  findAll(): Promise<T[]>;
  findById(id: string): Promise<T | null>;
}

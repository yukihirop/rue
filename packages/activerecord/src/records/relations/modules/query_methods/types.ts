export type Directions = 'asc' | 'desc' | 'ASC' | 'DESC';

export type ScopeMethods = 'group' | 'limit' | 'offset' | 'order' | 'where';

export type ScopeParams<U> = {
  where: Partial<U>;
  order: { [P in keyof U]: Directions };
  offset: number;
  limit: number;
  group: string[];
};

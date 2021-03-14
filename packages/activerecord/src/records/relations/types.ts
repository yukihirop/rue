import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Relation$Holder } from './holder';

export type PromiseOriginalResolve<T> = (records?: T[] | { [key: string]: T[] }) => void;
export type PromiseResolve<T> = (
  records?: T | T[] | PromiseLike<T[]> | { [key: string]: T[] }
) => void;
export type PromiseResolveHolder<
  T extends ActiveRecord$Base,
  H extends ActiveRecord$Relation$Holder<T>
> = (value: [H, T[] | PromiseLike<T[]>]) => void;
export type PromiseReject<T> = PromiseResolve<T>;
export type PromiseExecutor<
  T extends ActiveRecord$Base,
  H extends ActiveRecord$Relation$Holder<T>
> = (resolve: PromiseResolveHolder<T, H>, reject: PromiseReject<any>) => void;

import { ActiveRecord$Base } from '@/records';
import { ActiveRecord$Relation$Holder } from './holder';

export type PromiseOriginalResolve<T> = (records?: T[] | { [key: string]: T[] }) => void;
export type PromiseResolve<T, S = PromiseLike<T[]>> = (
  records?: T | T[] | { [key: string]: T[] | S }
) => void;
export type PromiseResolveHolder<
  T extends ActiveRecord$Base,
  H extends ActiveRecord$Relation$Holder<T>,
  S = PromiseLike<T[]>
> = (value: { holder: H; scope: T[] | S }) => void;
export type PromiseReject<T> = PromiseResolve<T>;
export type PromiseExecutor<
  T extends ActiveRecord$Base,
  H extends ActiveRecord$Relation$Holder<T>,
  S = PromiseLike<T[]>
> = (resolve: PromiseResolveHolder<T, H, S>, reject: PromiseReject<any>) => void;

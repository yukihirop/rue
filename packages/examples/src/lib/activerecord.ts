import { ActiveRecord$Base, RueSetup } from '@ruejs/rue';

// types
import type * as t from '@ruejs/rue';

@RueSetup
export class ActiveRecord<T extends t.Record$Params> extends ActiveRecord$Base<T> {}

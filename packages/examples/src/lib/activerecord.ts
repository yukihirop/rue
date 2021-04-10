import { ActiveRecord$Base, RueSetup } from '@rue/rue';

// types
import type * as t from '@rue/rue';

@RueSetup
export class ActiveRecord<T extends t.Record$Params> extends ActiveRecord$Base<T> {}

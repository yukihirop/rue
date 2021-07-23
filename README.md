# Rue

Let's develop a SPA with a [rails](https://github.com/rails/rails) API.  

However, we have decided that we will not get much benefit and are currently suspending development. 😭

## Packages

- `@ruejs/rue`
  - `@ruejs/activemodel`
  - `@ruejs/activerecord`
  - `@ruejs/config`
  - `@ruejs/cli`

## What it Rue ?

It is a micro library that aims to provide functions such as activerecord and activemodel of rails by borrowing the `src/rue` directory in SPA projects such as

You can start console(`rue console`) like rails ( `rails console`).


```bash
$ yarn console:examples
yarn run v1.22.10
$ cd packages/examples && yarn rue:console
$ rue console
[Node] Welcome to Node.js v12.7.0.
[Node] Type ".help" for more information.
[Rue] Loading Rue Modules 52/112.Please override 'this._state'
[Rue] Loading Rue Modules 56/112.
🍛 >
```

Let's get the list of loaded classes.

```bash
🍛 > .loaded
[Rue] Loading Rue Modules 1/112.Please override 'this._state'
[Rue] Loading Rue Modules 56/112.
[
  'Rue',
  'ActiveSupport$Registry$Base',
  'ActiveSupport$Base',
  'ActiveSupport$Info',
  'ActiveModel$Base',
  'ActiveModel$Impl',
  'ActiveModel$Cachable',
  'ActiveModel$Translation',
  'ActiveModel$Validations',
  'ActiveRecord$Impl',
  'ActiveRecord$Base',
  'ActiveRecord$Associations$Holder',
  'ActiveRecord$Relation$Base',
  'ActiveRecord$Relation$Holder',
  'ActiveRecord$Relation$Impl',
  'ActiveRecord$Associations$CollectionProxy$Base',
  'ActiveRecord$Associations$CollectionProxy$Holder',
  'ActiveRecord$Associations$CollectionProxy$Impl',
  'ActiveRecord$Associations$Relation$Base',
  'ActiveRecord$AttributeMethods',
  'ActiveRecord$Core',
  'ActiveRecord$Associations',
  'ActiveRecord$Associations$Impl',
  'ActiveRecord$Dirty',
  'ActiveRecord$Meta',
  'ActiveRecord$Persistence',
  'ActiveRecord$Querying',
  'ActiveRecord$Scoping',
  'ActiveRecord$Scoping$Impl',
  'ActiveRecord$Scoping$Named',
  'ActiveRecord$Associations$Persistence',
  'ActiveRecord$Associations$PersistenceStrategy',
  'ActiveRecord$FinderMethods',
  'ActiveRecord$QueryMethods',
  'ActiveRecord$QueryMethods$Evaluator',
  'Account',
  'Profile',
  'Task',
  'TmpUser',
  'User'
]
🍛 >
```

You can see that the rue class and module and ActiveRecord and ActiveModel set in exampels are loaded.

Let's pay attention to the `Account` record and investigate various things.

You can see the methods that can be called for the `Account` record below.


```bash
🍛 > .ls Account
{
  Account: [ 'fromName' ],
  ActiveRecord: [],
  'ActiveRecord$Base': [ 'fetchAll', 'resetRecordCache' ],
  'ActiveRecord$Impl': [],
  'ActiveModel$Base': [],
  'ActiveRecord$Associations (RueModule)': [ 'belongsTo', 'hasOne', 'hasMany' ],
  'ActiveRecord$Associations$Impl (RueModule)': [],
  'ActiveRecord$Associations$Persistence (RueModule)': [],
  'ActiveRecord$Persistence (RueModule)': [
    'createSync',
    'createSyncOrThrow',
    'deleteSync',
    'destroySync',
    'updateSync',
    'create',
    'createOrThrow',
    'delete',
    'destroy',
    'update',
    'RUE_AUTO_INCREMENT_RECORD_ID',
    'RUE_RECORD_ID',
    'RUE_CREATED_AT',
    'RUE_UPDATED_AT',
    'RECORD_ALL',
    'RECORD_META'
  ],
  'ActiveRecord$AttributeMethods (RueModule)': [],
  'ActiveRecord$Dirty (RueModule)': [],
  'ActiveRecord$Core (RueModule)': [ 'find' ],
  'ActiveRecord$Scoping (RueModule)': [],
  'ActiveRecord$Scoping$Impl (RueModule)': [],
  'ActiveRecord$Scoping$Named (RueModule)': [ 'all', 'scope' ],
  'ActiveRecord$Querying (RueModule)': [
    'find',                  'findBy',
    'findByOrThrow',         'take',
    'takeOrThrow',           'first',
    'firstOrThrow',          'last',
    'lastOrThrow',           'isExists',
    'isAny',                 'isMany',
    'isNone',                'isOne',
    'findOrCreateBy',        'findOrCreateByOrThrow',
    'findOrInitializeBy',    'createOrFindBy',
    'createOrFindByOrThrow', 'destroyAll',
    'deleteAll',             'updateAll',
    'touchAll',              'destroyBy',
    'deleteBy',              'where',
    'rewhere',               'order',
    'reorder',               'offset',
    'limit',                 'group',
    'unscope'
  ],
  'ActiveRecord$Meta (RueModule)': [ 'meta', 'recordsWithMeta' ],
  'ActiveModel$Impl': [],
  'ActiveModel$Translation (RueModule)': [
    'translate',
    '$t',
    'humanPropertyName',
    'humanPropName',
    'humanAttributeName'
  ],
  'ActiveModel$Validations (RueModule)': [ 'validates' ],
  'ActiveModel$Cachable (RueModule)': [ 'checkUniqueKey' ],
  Function: [ 'apply', 'bind', 'call', 'toString' ],
  Object: [
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toString',
    'valueOf',
    'toLocaleString'
  ]
}
```

You can know the result for each class and module defined in this way.

It behaves just like the `pry-rails` of `ls Account`.

```
[1] pry(main)> ls Account
Object.methods: yaml_tag
ActiveModel::Naming#methods: model_name
ActiveSupport::Benchmarkable#methods: benchmark
ActiveSupport::DescendantsTracker#methods: descendants  direct_descendants  subclasses
ActiveRecord::ConnectionHandling#methods:
  clear_active_connections!              clear_reloadable_connections!  connected_to_many  connection_db_config            connects_to                mysql2_connection    while_preventing_writes
  clear_all_connections!                 connected?                     connecting_to      connection_pool                 establish_connection       primary_class?
  clear_cache!                           connected_to                   connection         connection_specification_name   flush_idle_connections!    remove_connection
  clear_query_caches_for_current_thread  connected_to?                  connection_config  connection_specification_name=  lookup_connection_handler  retrieve_connection

......

```

Let's play with the Account record for a moment.


### If you want to get a list of Account records

See here for `Account` and `Task` codes.

- [Account](https://github.com/yukihirop/rue/blob/main/packages/examples/src/records/account.ts)
- [Task](https://github.com/yukihirop/rue/blob/main/packages/examples/src/records/task.ts)

```js
🍛 > accounts = await Account.all()
[
  Account {
    errors: { name: [], email: [] },
    __rue_record_id__: 1,
    id: 1,
    name: 'name_1',
    email: 'name_1@example.com',
    info: { github: 'aaa' },
    _newRecord: false,
    _destroyed: false,
    _associationCache: {},
    tasks: [Function: value],
    profile: [Function: value],
    __rue_created_at__: '2021-07-23T12:38:42+09:00',
    __rue_updated_at__: '2021-07-23T12:38:42+09:00'
  },
  Account {
    errors: { name: [], email: [] },
    __rue_record_id__: 2,
    id: 2,
    name: 'name_2',
    email: 'name_2@example.com',
    info: { github: 'bbb' },
    _newRecord: false,
    _destroyed: false,
    _associationCache: {},
    tasks: [Function: value],
    profile: [Function: value],
    __rue_created_at__: '2021-07-23T12:38:42+09:00',
    __rue_updated_at__: '2021-07-23T12:38:42+09:00'
  },
  Account {
    errors: { name: [], email: [] },
    __rue_record_id__: 3,
    id: 3,
    name: 'name_3',
    email: 'name_3@example.com',
    info: { github: 'ccc' },
    _newRecord: false,
    _destroyed: false,
    _associationCache: {},
    tasks: [Function: value],
    profile: [Function: value],
    __rue_created_at__: '2021-07-23T12:38:42+09:00',
    __rue_updated_at__: '2021-07-23T12:38:42+09:00'
  },
  Account {
    errors: { name: [], email: [] },
    __rue_record_id__: 4,
    id: 4,
    name: 'name_4',
    email: 'name_4@example.com',
    info: { github: 'ddd' },
    _newRecord: false,
    _destroyed: false,
    _associationCache: {},
    tasks: [Function: value],
    profile: [Function: value],
    __rue_created_at__: '2021-07-23T12:38:42+09:00',
    __rue_updated_at__: '2021-07-23T12:38:42+09:00'
  },
  Account {
    errors: { name: [], email: [] },
    __rue_record_id__: 5,
    id: 5,
    name: 'name_5',
    email: 'name_5@example.com',
    info: { github: 'eee' },
    _newRecord: false,
    _destroyed: false,
    _associationCache: {},
    tasks: [Function: value],
    profile: [Function: value],
    __rue_created_at__: '2021-07-23T12:38:42+09:00',
    __rue_updated_at__: '2021-07-23T12:38:42+09:00'
  },
  Account {
    errors: { name: [], email: [] },
    __rue_record_id__: 6,
    id: 6,
    name: 'name_6',
    email: 'name_6@example.com',
    info: { github: 'fff' },
    _newRecord: false,
    _destroyed: false,
    _associationCache: {},
    tasks: [Function: value],
    profile: [Function: value],
    __rue_created_at__: '2021-07-23T12:38:42+09:00',
    __rue_updated_at__: '2021-07-23T12:38:42+09:00'
  },
  Account {
    errors: { name: [], email: [] },
    __rue_record_id__: 7,
    id: 7,
    name: 'name_7',
    email: 'name_7@example.com',
    info: { github: 'yukihirop' },
    _newRecord: false,
    _destroyed: false,
    _associationCache: {},
    tasks: [Function: value],
    profile: [Function: value],
    __rue_created_at__: '2021-07-23T12:38:42+09:00',
    __rue_updated_at__: '2021-07-23T12:38:42+09:00'
  }
]
```

### If you want to get a relationship

`Account` has relationships to `Profile` and `Task` records. Let's examine it.

```ts
// Register Relashionships
Account.hasMany<Task>('tasks', { klass: Task, foreignKey: 'accountId' });
Account.hasOne<Profile>('profile', { klass: Profile, foreignKey: 'accountId' });
```

```js
🍛 > accounts[0].tasks()
Task$ActiveRecord_Associations_CollectionProxy [Promise] {
  {
    holder: ActiveRecord$Associations$CollectionProxy$Holder {
      isHolder: true,
      recordKlass: [Function],
      scope: [],
      _defaultScopeParams: [Object],
      scopeParams: [Object],
      groupedRecords: {},
      errors: [],
      proxy: [],
      flags: [Object],
      associationData: [Object],
      foreignKeyData: [Object]
    },
    scope: Task$ActiveRecord_AssociationRelation [Promise] { <pending> }
  },
  where: [Function],
  rewhere: [Function],
  order: [Function],
  reorder: [Function],
  reverseOrder: [Function],
  offset: [Function],
  limit: [Function],
  group: [Function],
  unscope: [Function],
  find: [Function],
  first: [Function],
  isInclude: [Function],
  last: [Function],
  recordKlass: [Function: Task] { fromStatus: [Function: value] }
}
```

In terms of `rails`, it looks like the following.

```ruby
irb(main):001:0> account = Account.first
  Account Load (0.4ms)  SELECT "accounts".* FROM "accounts" ORDER BY "accounts"."id" ASC LIMIT $1  [["LIMIT", 1]]
=> #<Account id: 1, fullName: "name_1", email: "name_1@example.com", github: "Ted Casper", created_at: "2021-07-23 04:05:13.729072000 +0000", updated_at: "2021-07-23 04:05:13.729072000 +0000">

irb(main):002:0> task = account.tasks
  Task Load (0.6ms)  SELECT "tasks".* FROM "tasks" WHERE "tasks"."account_id" = $1 /* loading for inspect */ LIMIT $2  [["account_id", 1], ["LIMIT", 11]]
=> #<ActiveRecord::Associations::CollectionProxy [#<Task id: 1, content: "aut", status: "wip", account_id: 1, created_at: "2021-07-23 04:05:13.752600000 +0000", updated_at: "2021-07-23 04:05:13.752600000 +0000">, #<Task id: 2, content: "rerum", status: "wip", account_id: 1, created_at: "2021-07-23 04:05:13.758269000 +0000", updated_at: "2021-07-23 04:05:13.758269000 +0000">]>

irb(main):003:0> task.class
=> Task::ActiveRecord_Associations_CollectionProxy
```

An instance of CollectionProxy is returning and has not yet been evaluated.  
You need to call or await the promise then to evaluate.

```js
🍛 > await accounts[0].tasks()
[
  Task {
    errors: { content: [], status: [] },
    __rue_record_id__: 1,
    id: 1,
    content: 'Create @ruejs of web micro framework',
    status: 'wip',
    accountId: 1,
    _newRecord: false,
    _destroyed: false,
    _associationCache: {},
    account: [Function: value],
    __rue_created_at__: '2021-07-23T12:42:00+09:00',
    __rue_updated_at__: '2021-07-23T12:42:00+09:00'
  },
  Task {
    errors: { content: [], status: [] },
    __rue_record_id__: 2,
    id: 2,
    content: 'Update r2-oas gem',
    status: 'success',
    accountId: 1,
    _newRecord: false,
    _destroyed: false,
    _associationCache: {},
    account: [Function: value],
    __rue_created_at__: '2021-07-23T12:42:00+09:00',
    __rue_updated_at__: '2021-07-23T12:42:00+09:00'
  }
]
```

For example, what happens if you try to get the one when the status is `wip` ?

```js
🍛 > await accounts[0].tasks().where({status: 'wip'})
[
  Task {
    errors: { content: [], status: [] },
    __rue_record_id__: 1,
    id: 1,
    content: 'Create @ruejs of web micro framework',
    status: 'wip',
    accountId: 1,
    _newRecord: false,
    _destroyed: false,
    _associationCache: {},
    account: [Function: value],
    __rue_created_at__: '2021-07-23T12:42:00+09:00',
    __rue_updated_at__: '2021-07-23T12:42:00+09:00'
  }
]
```

```js
🍛 > task = await accounts[0].tasks().findBy({status: 'wip'})
Task {
  errors: { content: [], status: [] },
  __rue_record_id__: 1,
  id: 1,
  content: 'Create @ruejs of web micro framework',
  status: 'wip',
  accountId: 1,
  _newRecord: false,
  _destroyed: false,
  _associationCache: {},
  account: [Function: value],
  __rue_created_at__: '2021-07-23T12:42:00+09:00',
  __rue_updated_at__: '2021-07-23T12:42:00+09:00'
}
```

On the contrary, since the `BelongsTo` association is pasted from `Task` to `Account`, you can get it.

```
🍛 > task.account()
Thrown:
TypeError: Cannot read property 'findBy' of undefined
    at Task.value [as account] (/Users/yukihirop/JavaScriptProjects/rue/packages/activerecord/src/records/modules/associations/core.ts:355:24)
    at relationFn (/Users/yukihirop/JavaScriptProjects/rue/packages/activerecord/src/records/modules/associations/core.ts:68:14)
```

Oops ... a little buggy now 😅

### If you want to see the implementation of `ActiveRecord$Base`

You can see the implementation using the `.show` command.

```ts
🍛 > .show ActiveRecord$Base

From: rue/packages/activerecord/src/records/base.ts#L17-60
Owner: ActiveRecord$Base
Number of lines: 44
Updated At: 2021/07/23 13:32:04 +09:00

export class ActiveRecord$Base<P extends t.Params = t.Params> extends ActiveRecord$Impl<P> {
  public errors: t.Validations$Errors;

  constructor(data?: Partial<P>) {
    super();

    (this as any)[RUE_RECORD_ID] = undefined;

    if (data) {
      Object.keys(data).forEach((key) => {
        (this as any)[key] = data[key];
      });
    }

    this._newRecord = true;
    this._destroyed = false;
    this._associationCache = {};

    ActiveRecord$Impl.defineAssociations(this);
  }

  // override
  static get objType(): t.ObjType {
    return 'record';
  }

  protected fetchAll(): Promise<P[] | [] | { all?: P[]; meta?: any }> {
    throw "Please implement 'fetchAll' in Inherited Class";
  }

  // All starting points
  protected static fetchAll(): Promise<t.Params[] | { all?: t.Params[]; meta?: any }> {
    const instance = new this();
    return instance.fetchAll();
  }

  static resetRecordCache() {
    const cacheKey = this.uniqueKey;
    RecordCache.destroy(cacheKey);
    RecordCache.create(cacheKey, RECORD_ALL, []);
    RecordCache.create(cacheKey, RECORD_META, {});
    RecordCache.create(cacheKey, RUE_AUTO_INCREMENT_RECORD_ID, 1);
  }
}
```

You can see any class provided by `rue` displayed in `.loaded`.

<details>

```ts
🍛 > .show ActiveRecord$Associations$CollectionProxy$Base

From: rue/packages/activerecord/src/records/associations/collection_proxy/base.ts#L24-671
Owner: ActiveRecord$Associations$CollectionProxy$Base
Number of lines: 648
Updated At: 2021/07/23 13:32:05 +09:00

export class ActiveRecord$Associations$CollectionProxy$Base<
  T extends ActiveRecord$Base
> extends ActiveRecord$Associations$CollectionProxy$Impl<T> {
  /**
   * @see https://gist.github.com/domenic/8ed6048b187ee8f2ec75
   * @description Method for getting results. Do not call it in any other method.
   */
  rueThen(
    onFulfilled: rt.PromiseResolve<T, ActiveRecord$Relation<T>>,
    onRejected?: rt.PromiseReject<any>
  ) {
    return this.superThen((value) => {
      /**
       * If you use the `ActiveRecord$QueryMethods` methods, it will enter this branch
       * There are times when 「 value['holder'] instanceof ActiveRecord$Relation$Holder 」 cannot evaluate correctly. (Cause unknown)
       */
      if (
        typeof value === 'object' &&
        value != null &&
        value['holder'] &&
        value['holder']['isHolder']
      ) {
        const { holder, scope } = value;

        if (scope instanceof Promise) {
          scope.rueThen((r) => {
            holder.scope = r as T[];
            Evaluator.all(holder);

            if (Object.keys(holder.groupedRecords).length > 0) {
              return onFulfilled(holder.groupedRecords);
            } else {
              return onFulfilled(holder.scope);
            }
          });
        } else {
          holder.scope = scope as T[];

          Evaluator.all(holder);

          if (Object.keys(holder.groupedRecords).length > 0) {
            return onFulfilled(holder.groupedRecords);
          } else {
            return onFulfilled(holder.scope);
          }
        }
      } else {
        /**
         * value is records ((e.g.) T | T[])
         * @description type error
         */
        // @ts-expect-error
        return onFulfilled(value);
      }
    }, onRejected);
  }

  /**
   * @description All methods are delegated to this instance
   * @see https://github.com/rails/rails/blob/5aaaa1630ae9a71b3c3ecc4dc46074d678c08d67/activerecord/lib/active_record/associations/collection_proxy.rb#L1100-L1109
   */
  scope(): ActiveRecord$Associations$Relation<
    T,
    ActiveRecord$Associations$CollectionProxy$Holder<T>,
    ActiveRecord$Relation<T>
  > {
    return this.superThen(({ holder, scope }) => {
      return { scope, holder };
    });
  }

  /**
   * @see https://github.com/rails/rails/blob/5aaaa1630ae9a71b3c3ecc4dc46074d678c08d67/activerecord/lib/active_record/associations/collection_proxy.rb#L1100-L1109
   */
  scoping<U>(
    callback: (holder: ActiveRecord$Associations$CollectionProxy$Holder<T>) => U | Promise<U>
  ): Promise<U> {
    return this.superThen(({ holder, scope }) => {
      if (scope instanceof Promise) {
        return scope.rueThen((records) => {
          holder.scope = records as T[];
          /**
           * @description Pass by value so that 「proxy === record」 does not occur
           */
          if (Object.keys(holder.proxy).length === 0) holder.proxy = Array.from(records as T[]);
          Evaluator.all(holder);
          return callback(holder);
        });
      } else {
        holder.scope = scope as T[];
        /**
         * @description Pass by value so that 「proxy === record」 does not occur
         */
        if (Object.keys(holder.proxy).length === 0) holder.proxy = Array.from(scope);
        Evaluator.all(holder);
        return callback(holder);
      }
    });
  }

  /**
   * @description delegate to `scope`
   */
  where = <U extends it.Record$Params>(params: Partial<U>): this => {
    // @ts-expect-error
    this.scope().superThen(({ holder }) => {
      Object.assign(holder.scopeParams.where, params || {});
    });

    return this;
  };

  /**
   * @description delegate to `scope`
   */
  rewhere = <U extends it.Record$Params>(params: Partial<U>): this => {
    // @ts-expect-error
    this.scope().superThen(({ holder }) => {
      holder.scopeParams.where = params || {};
      Object.assign(params, holder.foreignKeyData);
    });

    return this;
  };

  /**
   * @description delegate to `scope`
   */
  order = <U = { [key: string]: rmt.QueryMethods$Directions }>(params: U): this => {
    // @ts-expect-error
    this.scope().superThen(({ holder }) => {
      Object.assign(holder.scopeParams.order, params || {});
    });

    return this;
  };

  /**
   * @description delegate to `scope`
   */
  reorder = <U = { [key: string]: rmt.QueryMethods$Directions }>(params: U): this => {
    // @ts-expect-error
    this.scope().superThen(({ holder }) => {
      holder.scopeParams.order = params || {};
    });

    return this;
  };

  /**
   * @description delegate to `scope`
   */
  reverseOrder = (): this => {
    // @ts-expect-error
    this.scope().superThen(({ holder }) => {
      const orderParams = holder.scopeParams.order;
      if (isPresent(orderParams)) {
        Object.keys(orderParams).forEach((propName) => {
          const direction = orderParams[propName];
          if (['desc', 'DESC'].includes(direction)) {
            holder.scopeParams.order[propName] = 'asc';
          } else if (['asc', 'ASC'].includes(direction)) {
            holder.scopeParams.order[propName] = 'desc';
          }
        });
      } else {
        holder.scopeParams.order['id'] = 'asc';
      }
    });

    return this;
  };

  /**
   * @description delegate to `scope`
   */
  offset = (value: number): this => {
    // @ts-expect-error
    this.scope().superThen(({ holder }) => {
      holder.scopeParams.offset = value;
    });

    return this;
  };

  /**
   * @description delegate to `scope`
   */
  limit = (value: number): this => {
    // @ts-expect-error
    this.scope().superThen(({ holder }) => {
      holder.scopeParams.limit = value;
    });

    return this;
  };

  /**
   * @description Behavior is different from rails group
   * @description delegate to `scope`
   */
  group = <U = { [key: string]: any }>(...props: Array<keyof U>): this => {
    // @ts-expect-error
    this.scope().superThen(({ holder }) => {
      // @ts-expect-error
      holder.scopeParams.group = props;
    });

    return this;
  };

  /**
   * @description delegate to `scope`
   */
  unscope = (...scopeMethods: rmt.QueryMethods$ScopeMethods[]): this => {
    const { SCOPE_METHODS } = ActiveRecord$QueryMethods;

    // @ts-expect-error
    this.scope().superThen(({ holder }) => {
      if (scopeMethods.length === 0) {
        const err = errObj({
          code: ErrCodes.ARGUMENT_IS_INVALID,
          message: `'unscope()' must contain arguments.`,
        });
        holder.errors.push(err);
      } else if (isSuperset(SCOPE_METHODS, scopeMethods)) {
        scopeMethods.forEach((scopeMethod) => {
          // @ts-expect-error
          if (holder._defaultScopeParams[scopeMethod]) {
            holder.scopeParams[scopeMethod] = Object.assign(
              {},
              // @ts-expect-error
              JSON.parse(JSON.stringify(holder._defaultScopeParams[scopeMethod]))
            );
          } else {
            holder.scopeParams[scopeMethod] = undefined;
          }
        });
      } else {
        const err = errObj({
          code: ErrCodes.ARGUMENT_IS_INVALID,
          message: `Called 'unscope()' with invalid unscoping argument '[${scopeMethods}]'. Valid arguments are '[${SCOPE_METHODS}]'.`,
        });
        holder.errors.push(err);
      }
    });

    return this;
  };

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-empty-3F
   * @description use holder.proxy
   */
  isEmpty(): Promise<boolean> {
    return this.scoping<boolean>((holder) => {
      return holder.proxy.length === 0;
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-find
   */
  find = <U extends it.Record$Params>(...ids: it.Record$PrimaryKey[]): Promise<T | T[]> => {
    if (ids.length === 0) {
      throw errObj({
        code: ErrCodes.RECORD_NOT_FOUND,
        // @ts-expect-error
        message: `Could'nt find '${this.recordKlass.uniqueKey}' without an 'id'`,
      });
    } else {
      // @ts-expect-error
      return this.where<U>({ id: ids }).scoping((holder) => {
        if (holder.scope.length === 0) {
          if (ids.length === 1) {
            throw errObj({
              code: ErrCodes.RECORD_NOT_FOUND,
              params: {
                // @ts-expect-error
                resource: this.recordKlass.uniqueKey,
                id: ids[0],
              },
            });
          } else {
            throw errObj({
              code: ErrCodes.RECORD_NOT_FOUND,
              // @ts-expect-error
              message: `Could't find all '${this.recordKlass.uniqueKey}' with 'id': [${ids}] (found 0 results, but was looking for ${ids.length})`,
            });
          }
        } else if (holder.scope.length === 1) {
          return holder.scope[0];
        } else {
          return holder.scope;
        }
      });
    }
  };

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-any-3F
   * @description use holder.proxy
   */
  isAny(filter?: (record: T) => boolean): Promise<boolean> {
    return this.scoping<boolean>((holder) => {
      return holder.proxy.filter(filter || Boolean).length > 0;
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-build
   * @description use holder.proxy
   */
  build<U>(params?: Partial<U> | Array<Partial<U>>, yielder?: (self: T) => void): Promise<T | T[]> {
    return this.scoping((holder) => {
      holder.flags.useProxy = true;
      if (Array.isArray(params)) {
        return params.map((param) => {
          const merged = Object.assign(param || {}, holder.foreignKeyData);
          const record = new this.recordKlass(merged);
          if (yielder) yielder(record);
          holder.proxy.push(record);
          return record;
        });
      } else {
        const merged = Object.assign(params || {}, holder.foreignKeyData);
        const record = new this.recordKlass(merged);
        if (yielder) yielder(record);
        holder.proxy.push(record);
        return record;
      }
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-create
   * @description use holder.proxy
   */
  create<U>(
    params?: Partial<U> | Array<Partial<U>>,
    yielder?: (self: T) => void
  ): Promise<T | T[]> {
    return this.scoping((holder) => {
      const merged = Object.assign(params || {}, holder.foreignKeyData);
      // @ts-ignore
      return this.recordKlass.create(merged, (self) => {
        if (yielder) yielder(self);
        holder.scope.push(self);
        holder.proxy.push(self);
      });
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-create-21
   * @description use holder.proxy
   */
  createOrThrow<U>(
    params?: Partial<U> | Array<Partial<U>>,
    yielder?: (self: T) => void
  ): Promise<T> {
    return this.scoping((holder) => {
      const merged = Object.assign(params || {}, holder.foreignKeyData);
      // @ts-expect-error
      return this.recordKlass.createOrThrow(merged, (self) => {
        if (yielder) yielder(self);
        holder.scope.push(self);
        holder.proxy.push(self);
      });
    });
  }

  /**
   * The return value type is different from that of rails.
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-delete
   */
  delete(...recordsOrIds: T[] | it.Record$PrimaryKey[]): Promise<T[]> {
    return this.scoping<T[]>((holder) => {
      let recordIds: it.Record$PrimaryKey[] = [];

      recordsOrIds.forEach((recordOrId) => {
        if (recordOrId instanceof ActiveRecord$Base) {
          recordIds.push((recordOrId as T).id);
        } else {
          recordIds.push(recordOrId);
        }
      });

      return this.find<T>(...recordIds).then((records: T[]) => {
        const foreignKey = Object.keys(holder.foreignKeyData)[0];
        const deletedRecords = records.map((record) => {
          // dependent: 'nullify'
          record.update({ [foreignKey]: undefined });
          return record;
        });
        const destroyedIds = deletedRecords.map((r) => r.id);
        const newScope = Array.from(holder.scope).reduce((acc, record) => {
          if (!destroyedIds.includes(record.id)) {
            acc.push(record);
          }
          return acc;
        }, []);
        holder.scope = Array.from(newScope);
        holder.proxy = Array.from(newScope);
        return deletedRecords;
      });
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-destroy
   * @description use holder.proxy
   */
  destroy(...recordsOrIds: T[] | it.Record$PrimaryKey[]): Promise<T[] | null> {
    return this.scoping((holder) => {
      let recordIds: it.Record$PrimaryKey[] = [];

      recordsOrIds.forEach((recordOrId) => {
        if (recordOrId instanceof ActiveRecord$Base) {
          recordIds.push((recordOrId as T).id);
        } else {
          recordIds.push(recordOrId);
        }
      });

      if (recordIds.length === 0) {
        /**
         * @description Make it behave the same as rails
         */
        return null;
      } else {
        return this.find<T>(...recordIds).then((records: T[]) => {
          return Promise.all(records.map((record) => record.destroy<T>())).then(
            (destroyedRecords) => {
              const destroyedIds = destroyedRecords.map((r) => r.id);
              const newScope = Array.from(holder.scope).reduce((acc, record) => {
                if (!destroyedIds.includes(record.id)) {
                  acc.push(record);
                }
                return acc;
              }, []);
              holder.scope = Array.from(newScope);
              holder.proxy = Array.from(newScope);
              return destroyedRecords;
            }
          );
        });
      }
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-pluck
   * @description use holder.proxy
   */
  pluck<U extends it.Record$Params>(...propNames: Array<keyof U>): Promise<Array<ct.valueOf<U>>> {
    return this.scoping<Array<ct.valueOf<U>>>((holder) => {
      const plucked = holder.proxy.map((record) => {
        let result;

        if (propNames.length === 0) {
          result = Object.keys(record).reduce((acc, propName: string) => {
            if (
              !propName.startsWith('_') &&
              !(typeof record[propName] === 'function') &&
              !(propName == 'errors')
            ) {
              acc.push(record[propName]);
            }
            return acc;
          }, [] as Array<ct.valueOf<U>>);
        } else {
          result = propNames.reduce((acc, propName: string) => {
            acc.push(record[propName]);
            return acc;
          }, [] as Array<ct.valueOf<U>>);
        }
        return result;
      });

      if (propNames.length === 1) {
        return plucked.flat();
      } else {
        return plucked;
      }
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-count
   */
  count<U extends it.Record$Params>(
    propName?: keyof U,
    filter?: (self: T) => boolean
  ): Promise<number | { [key: string]: number }> {
    return this.superThen(({ holder }) => {
      // @ts-expect-error
      return this.recordKlass.all().superThen(({ holder: newHolder }) => {
        // deep coppy
        newHolder.scopeParams = Object.assign({}, JSON.parse(JSON.stringify(holder.scopeParams)));
        Object.assign(newHolder.scopeParams.where, holder.foreignKeyData);
        Evaluator.all(newHolder);

        if (isPresent(newHolder.groupedRecords)) {
          return Object.keys(newHolder.groupedRecords).reduce((acc, key) => {
            const records = newHolder.groupedRecords[key];
            acc[key] = records.length;
            return acc;
          }, {});
        } else {
          let result;

          if (propName) {
            result = newHolder.scope.filter((record) => record[propName]);
          } else {
            result = newHolder.scope;
          }

          if (filter) result = result.filter(filter);
          return result.length;
        }
      });
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-first
   * @description use holder.proxy
   */
  first = (limit?: number): Promise<T | T[]> => {
    if (!limit) limit = 1;
    return this.scoping((holder) => {
      const records = holder.proxy;
      if (records.length === 0) {
        return null;
      } else {
        const slicedRecords = records.slice(0, limit);

        if (limit === 1) return slicedRecords[0];
        return slicedRecords;
      }
    });
  };

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-include-3F
   * @description use holder.proxy
   */
  isInclude = (record: T | T[] | Promise<T | T[]>): Promise<boolean> => {
    return this.scoping<boolean>((holder) => {
      const allRecordIds = holder.proxy.map((r) => r['id']);
      if (record instanceof Promise) {
        return record.then((recordVal) => {
          if (recordVal && !Array.isArray(recordVal)) {
            return allRecordIds.includes(recordVal['id']);
          } else {
            /**
             * @description Same specifications as rails
             */
            return false;
          }
        });
      } else {
        if (record && !Array.isArray(record)) {
          return allRecordIds.includes(record['id']);
        } else {
          /**
           * @description Same specifications as rails
           */
          return false;
        }
      }
    });
  };

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-last
   * @description use holder.proxy
   */
  last = (limit?: number): Promise<T | T[]> => {
    if (!limit) limit = 1;
    return this.scoping((holder) => {
      const records = holder.proxy;
      if (records.length === 0) {
        return null;
      } else {
        const slicedRecords = records.reverse().slice(0, limit).reverse();

        if (limit === 1) return slicedRecords[0];
        return slicedRecords;
      }
    });
  };

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-many-3F
   * @description use holder.proxy
   */
  isMany(filter?: (record: T) => boolean): Promise<boolean> {
    return this.scoping<boolean>((holder) => {
      return holder.proxy.filter(filter || Boolean).length > 1;
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html#method-i-size
   * @description use holder.proxy
   */
  size(): Promise<number | { [key: string]: number }> {
    return this.scoping<number | { [key: string]: number }>((holder) => {
      if (isPresent(holder.groupedRecords)) {
        return Object.keys(holder.groupedRecords).reduce((acc, key) => {
          const records = holder.groupedRecords[key];
          acc[key] = records.length;
          return acc;
        }, {});
      } else {
        return holder.proxy.length;
      }
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Relation.html#method-i-to_a
   */
  toA(): Promise<T[]> {
    return this.scoping((holder) => {
      return holder.scope;
    });
  }

  /**
   * @see https://api.rubyonrails.org/classes/ActiveRecord/Relation.html#method-i-to_a
   */
  toArray(): Promise<T[]> {
    return this.toA();
  }

  _currentScope(): Promise<T[]> {
    return this.scoping((holder) => {
      if (holder.flags.useProxy) {
        return holder.proxy;
      } else {
        return holder.scope;
      }
    });
  }
}
```

</details>

### Other things you can do

You can check it with the `.help` command.

```
🍛 > .help
.ancs     [Rue] Display ancestors (like Ruby)
.break    Sometimes you get stuck, this gets you out
.clear    Break, and also clear the local context
.desc     [Rue] Display Object.getOwnPropertyDescriptors result
.editor   Enter editor mode
.exit     Exit the repl
.help     Print this help message
.load     Load JS from a file into the REPL session
.loaded   [Rue] Display loaded Classes or RueModules
.lp       [Rue] Display property list
.ls       [Rue] Display method list
.proto    [Rue] Display Object.getPrototypeOf result
.save     Save all evaluated commands in this REPL session to a file
.show     [Rue] Display method definition (format: <Class> or <Class>.<staticMethod> or <Class>.prototype.<instanceMethod>)

Press ^C to abort current expression, ^D to exit the repl
```

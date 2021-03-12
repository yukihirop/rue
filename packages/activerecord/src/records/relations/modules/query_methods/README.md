# ActiveRecord$QueryMethods

`-`: There are no plans to implement it.

## Methods

- [] and
- [] annotate
- [] createWith
- [] distinct
- [-] eagerLoad
- [-] extending
- [-] extractAssociated
- [-] from
- [x] group
- [] having
- [-] includes
- [-] joins
- [-] leftJoins
- [-] leftOuterJoins
- [x] limit
- [-] lock
- [] none
- [x] offset
- [-] optimizerHints
- [] or
- [x] order
- [-] preload
- [-] readonly
- [] references
- [x] reorder
- [-] reselect
- [x] reverseOrder
- [x] rewhere
- [-] select
- [-] strictLoading
- [-] forceUninq (Behavior unknown)
- [x] unscope
- [x] where

## Original Methods

It can be called at the end of all methods.

- [x] then
- [x] rueThen
- [x] catce
- [x] rueCatch

e.g.)

```ts
Record.where({ id: [1,2] }).then((records) => {...})
Record.where({ id: [1,2,3,4,5] }).limit(3).offset(1).rueThen((records) => {...})
Record.where({ id: [1,2,3,4,5] }).limit(3).offset(1).catch((err) => {...})
Record.where({ id: [1,2,3,4,5] }).limit(3).offset(1).rueCatch((err) => {...})
```

## Classes

- ActiveRecord$QueryMethods$WhereChain

## Reference

- [ActiveRecord::QueryMethods](https://api.rubyonrails.org/v6.1.0/classes/ActiveRecord/QueryMethods.html)
- [ActiveRecord::QueryMethods::WhereChain](https://api.rubyonrails.org/v6.1.0/classes/ActiveRecord/QueryMethods/WhereChain.html)

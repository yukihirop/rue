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

e.g.)

```ts
Record.where({ primaryKey: [1,2] }).toPA().then((records) => {...})
```

- [x]toPromiseArray
- [x]toPA (alias to `toPromiseArray`)

## Classes

- ActiveRecord$QueryMethods$WhereChain

## Reference

- [ActiveRecord::QueryMethods](https://api.rubyonrails.org/v6.1.0/classes/ActiveRecord/QueryMethods.html)
- [ActiveRecord::QueryMethods::WhereChain](https://api.rubyonrails.org/v6.1.0/classes/ActiveRecord/QueryMethods/WhereChain.html)

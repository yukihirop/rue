# ActiveRecord$Associations$CollectionProxy

## Methods

(i): inherited from `ActiveRecord$Relation`

- [x] isAny
- [ ] append
- [x] build
- [ ] calculate
- [ ] clear
- [ ] concat
- [x] count
- [x] create
- [x] createOrThrow
- [x] delete
- [x] deleteAll (i)
- [x] destroy
- [x] destroyAll (i)
- [ ] distinct
- [x] isEmpty
- [-] fifth
- [x] find (after implement `scope`)
- [x] first
- [-] fortyTwo
- [-] fourth
- [x] isInclude
- [x] last
- [-] length
- [-] loadTarget
- [-] loaded
- [-] isLoaded
- [x] isMany
- [-] new
- [x] pluck
- [ ] push
- [-] reload
- [ ] replace
- [ ] reset
- [x] scope (return `ActiveRecord$AssociationRelation` instance. Many methods are delegated)
- [-] second
- [-] secondToLast
- [-] select
- [x] size
- [x] take (i)
- [-] target
- [-] third
- [-] thirdToLast
- [x] scoping

## Original Methods

- [x]toA
- [x]toArray

## Methods (Delegate to `scope`)

`$[methodName]`: Means a destructive method. (in rails `[methodName]!`. internal methods)

- [-] $preload
- [-] $includes
- [-] $leftOuterJoins
- [-] reorderingValue
- [-] $reorder (internal methods)
- [-] $extending
- [-] lockValue
- [-] createWithValue
- [-] fromClause
- [-] setFromClause
- [-] setWhereClause
- [-] setHavingClause
- [-] $references (internal methods)
- [-] setIncludesValues
- [-] setEagerLoadValues
- [-] setPreloadValues
- [-] setReferencesValues
- [-] $group (internal methods)
- [-] setReorderingValue
- [-] $unscope (internal methods)
- [-] unscopeValues
- [-] setUnscopeValues
- [-] preload 
- [-] setJoinsValues
- [-] setLeftOuterJoinsValues
- [-] $or (internal methods)
- [-] egaerLoad
- [-] $having (internal methods)
- [-] $offset (internal methods)
- [-] setReadonlyValue
- [-] $from (internal methods)
- [-] setDistinctValue
- [-] setExtendingValues
- [x] where
- [-] $skipQueryCache
- [-] setSkipQueryCacheValue
- [ ] references
- [-] having 
- [-] $order (internal methods)
- [-] offsetValue
- [-] limitValue
- [ ] from
- [-] distinctValue 
- [-] $eagerLoad (internal methods)
- [-] setSelectValues
- [-] $lock (internal methods)
- [-] setLimitValue
- [-] reverseOrderValue
- [-] setreverseOrderValue
- [-] setOffsetValue
- [x] offset
- [-] $where (internal methods)
- [-] $createWith (internal methods)
- [x] reverseOrder
- [x] order
- [-] lockValue
- [x] limit
- [-] $readonly (internal methods)
- [-] whereClause
- [-] createWithValue
- [-] eagerLoadValues
- [-] includesValues
- [-] joinsValues
- [-] lefftOuterJoinsValues
- [-] preloadValues
- [-] readonlyValue
- [-] skipQueryCacheValue
- [-] referenncnesValues
- [-] includes
- [-] $reverseOrder (internal methods)
- [x] group
- [ ] none
- [-] $limit (internal methods)
- [ ] $_select (internal methods)
- [-] groupValues
- [ ] $joins (internal methods)
- [-] arel
- [-] lock
- [-] $none (internal methods)
- [-] orderValues
- [ ] or
- [-] $distinct (internal methods)
- [-] setOrderValues
- [x] reorder
- [-] joins
- [-] leftJoins
- [-] leftOuterJoins
- [x] rewhere
- [ ] readonly
- [-] extending
- [ ] createWith
- [x] unscope
- [-] havingClause
- [-] setGrupValues
- [-] getValue
- [-] extensions
- [-] extendingValues
- [-] spawn (In rails `[methodName]!` is a dedicated method for this)
- [ ] merge
- [ ] only
- [-] $merge (internal methods)
- [ ] except
- [-] scoping (inherited `ActiveRecord$Relation.prototype.scoping`)


## Reference

- [ActiveRecord::Associations::CollectionProxy](https://api.rubyonrails.org/classes/ActiveRecord/Associations/CollectionProxy.html)
- [delegate_methods](https://github.com/yukihirop/rue/issues/70#issuecomment-799098077)

/**
 * @Author sugo.io<asd>
 * @Date 17-9-14
 */

import { assert, isFunction, isNumber, isString, isArray, isObject } from '../../utils/utils'

/**
 * @typedef {Object} CollectionJSON
 * @property {Array} models
 * @property {Array} toDelete
 * @property {Array} toUpdate
 * @property {Array} toCreate
 */

/**
 * @typedef {Object} Collection
 * @property {Array<Object>} _models      - 所有model
 * @property {object} _cache      - 初始时保存的model，与_models作对比，确定应该添加、删除或更新
 * @property {object} _to_del     - 需要删除的记录
 * @property {object} _to_update  - 需要更新的记录
 * @property {object} _to_create  - 需要创建的记录
 * @property {string} _primaryKey - 主键字段
 *
 * @property {Function} reset   - 重置_cache
 * @property {Function} remove  - 删除一条记录
 * @property {Function} update  - 更新一条记录
 * @property {Function} add     - 添加一条记录
 * @property {Function} sort    - 排序
 * @property {Function} at      - 获取某个位置上的元素
 * @property {Function} last    - 获取最后一个元素
 * @property {Function} find    - 查找记录
 * @property {Function} get     - 获取所有的记录
 * @property {Function} toString
 * @property {Function} toJSON
 */

/**
 * @typedef {Object} CollectionDesc
 * @property {string} name
 * @property {string} primaryKey
 * @property {Function} scheduler
 */

const generate = (function () {
  let counter = 0
  return function () {
    return 'STORE_COLLECTION_PRIMARY_KEY_' + counter++
  }
})();

export default class Collection {
  /**
   * @param {string} primaryKey
   * @param {Array} mods
   */
  constructor (primaryKey, mods = []) {
    assert(isString(primaryKey) && !!primaryKey, 'Primary key must be a string and required')
    this._primaryKey = primaryKey;
    this.reset(mods)
  }

  /**
   * 重置Collection
   * @param {Array<Object>} mods
   * @return {Collection}
   * @private
   */
  reset (mods) {
    assert(isArray(mods), 'Models must be a Array')

    const map = {}
    const primaryKey = this._primaryKey

    mods.forEach(mod => {
      assert(isObject(mod), 'Each model muse be a object')
      map[mod[primaryKey]] = mod
    })

    this._cache = map
    // TODO use link data structure
    this._models = mods
    this._to_del = {}
    this._to_update = {}
    this._to_create = {}
    return this
  }

  /**
   * 移除model，可传primaryKey和model本身
   * @param {string|Object} keyOrMod
   * @return {Collection}
   */
  remove (keyOrMod) {

    const notPrimaryKey = isObject(keyOrMod)
    const primaryKey = notPrimaryKey ? keyOrMod[this._primaryKey] : keyOrMod

    this._models = this._models.filter(m => notPrimaryKey ? m !== keyOrMod : m[this._primaryKey] !== keyOrMod)
    this._to_del[primaryKey] = true
    this._to_create[primaryKey] = false
    this._to_update[primaryKey] = false
    return this
  }

  /**
   * 更新model
   * @param {string|number} primaryValue
   * @param {Object} props
   * @return {Collection}
   */
  update (primaryValue, props) {
    assert(isString(primaryValue) || isNumber(primaryValue), 'Primary value must be String or Number instance')
    assert(isObject(props), 'Props must be a Object')

    this._models = this._models.map(m => m[this._primaryKey] === primaryValue ? { ...m, ...props } : m)

    // 如果在创建列表，则不需要写入更新列表
    if (!this._to_create[primaryValue]) {
      this._to_update[primaryValue] = true
    }
    return this
  }

  /**
   * 添加model
   * @param {Object} mod
   * @return {Collection}
   */
  add (mod) {
    assert(isObject(mod), 'Model must be a Object')

    if (mod[this._primaryKey] === void 0) {
      mod[this._primaryKey] = generate()
    }

    this._models = this._models.concat(mod)
    this._to_create[mod[this._primaryKey]] = true
    return this
  }

  /**
   * 排序
   * @param {Function} compare
   * @return {Collection}
   */
  sort (compare) {
    assert(isFunction(compare), 'Compare must be a Function instance')
    this._models = this._models.sort(compare)
    return this
  }

  /**
   * 获取index位置的model
   * @param {number} index
   * @return {Object|null}
   */
  at (index) {
    return this._models[index] || null
  }

  /**
   * 获取最后一个model
   * @return {Object}
   */
  last () {
    return this.at(this._models.length - 1)
  }

  /**
   * 查找model
   * @param {Object} filter
   * @return {Object|null}
   */
  find (filter) {
    assert(isObject(filter), 'Filter must be a Object')

    const keys = Object.keys(filter)

    // 如果没有传入比较属性，直接返回null
    if (keys.length === 0) {
      return null
    }

    return this._models.find(mod => keys.every(k => filter[k] === mod[k])) || null
  }

  /**
   * 返回所有model
   * @return {Array.<Object>}
   */
  get () {
    return this._models.slice()
  }

  /**
   * @return {string}
   */
  toString () {
    return '[object StoreCollection]'
  }

  /**
   * 将所有的model分为三类:toDelete\toUpdate\toCreate并返回
   * @return {{models: Array.<Object>, toDelete: Array, toUpdate: Array, toCreate: Array}}
   */
  toJSON () {
    const toDelete = []
    const toUpdate = []
    const toCreate = []

    const md = this._to_del
    const mu = this._to_update
    const mc = this._to_create

    const primaryKey = this._primaryKey
    const cache = this._cache

    let key = null

    this._models.forEach(m => {
      key = m[primaryKey]

      if (mu[key]) {
        toUpdate.push(m)
      }

      if (mc[key]) {
        toCreate.push(m)
      }
    })

    for (let key in md) {
      if (md[key] && cache[key]) {
        toDelete.push(cache[key])
      }
    }

    return {
      models: this._models.slice(),
      toDelete,
      toUpdate,
      toCreate
    }
  }
}
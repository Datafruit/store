/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   31/01/2018
 * @description
 */

import { Model } from "./Model"
import { Description } from "../inter/Description"
import { Action } from "../../../core/inter/Action"
import { NextCallback } from "../../../core/inter/NextCallback"
import { Middleware } from "../../../core/inter/Middleware"
import { StateSignature } from "../../../core/inter/StateSignature"
import { Store } from "../../../core/impl/Store"
import { map } from "../../../core/impl/compatible"

export type CreatorArg<T> = Model<T> | Description<T>

export default function storeModelCreator<T extends StateSignature>(mods: CreatorArg<T>[],
                                                            store: Store<any>): Store<any> {

  const models = map<CreatorArg<T>, Model<T>>(mods, function (m: CreatorArg<T>) {
    return Model.isModel(m) ? m : new Model<T>(m)
  })

  map(models, function (mod: Model<T>) {
    store.use(<Middleware<any>>function (action: Action, state: any, next: NextCallback<T>) {
      mod.receiver(action, state, next)
    })
  })

  return store
}

/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   01/02/2018
 * @description
 */
import { wrap } from "../impl/utils"
import { ValidatorDecorate } from "../inter/ValidatorDecorate"

/**
 * 字符最大长度验证
 * @param {number} length
 * @param {string} [msg]
 * @return {ValidatorDecorate}
 */
export default function MaxLen(length: number, msg?: string): ValidatorDecorate {
  msg = msg || `{{key}}: Must be of type String that length less than ${length}`

  function validator(value: any): boolean {
    return typeof value === 'string' && value.length <= length
  }

  return wrap(validator, msg)
}

export {
  MaxLen
}
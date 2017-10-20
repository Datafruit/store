/**
 * @Author sugo.io<asd>
 * @Date 17-10-19
 */

import { decorate } from './valid'

/**
 * 左边界验证
 * @param {number} num
 * @param {string} [msg]
 * @return {ValidDecorate}
 */
function Min (num, msg) {
  msg = msg || `{{key}}: Must be of type umber and greater than ${num}`

  function validator (value) {
    return typeof value === 'number' && value >= num
  }

  return decorate(validator, msg)
}

export default Min
export {
  Min
}
export class Validate {

  /**
   *
   * @param value
   * @returns {boolean}
   */
  static isNotNull(value) {
    return value !== null;
  }

  /**
   *
   * @param value
   * @returns {boolean}
   */
  static isNotUndefined(value) {
    return value !== undefined;
  }

  /**
   *
   * @param value
   * @returns {boolean}
   */
  static isDefined(value) {
    return Validate.isNotNull(value) && Validate.isNotUndefined(value)
  }

  /**
   * @description It checks for the corresponding keys in the provided object that these are not null/undefined.
   * @param obj {Object<keys>}
   * @param keys {Array<string>}
   * @returns {boolean}
   */
  static requiredAll(obj, keys) {
    if(!obj) return false;
    let isValid = true;
    for(let key of keys) {
      if(!Validate.isDefined(obj[key])) {
        isValid = false;
        break;
      }
    }
    return isValid;
  }
}

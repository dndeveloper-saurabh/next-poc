import {useCallback, useEffect, useRef, useState} from "react";


export class Validators {
  static req(message) {
  return function(
  value,
  controls
) {
  return value !== undefined && value !== null && value.toString().trim().length > 0
    ? null
    : message
? message
    : "Required Field";
};
}
static minLen(val, message) {
  return function(
    value,
    controls
) {
    const ret =
      value.length >= val
        ? null
        : message
          ? message
          : "At least " + val + " characters";
    // console.log(this.value.length, val, ret);
    return ret;
  };
}
static maxLen(val, message) {
  return function(
    value,
    controls
) {
    return value.length <= val
      ? null
      : message
        ? message
        : "At max " + val + " characters";
  };
}
static isInt(options = {max: null, min: 1}, message) {
  function checkForMinMax(options, value) {
    const {min, max} = options;
    return (!min || value >= min) && (!max || value <= max);
  }

  return function(
    value,
    controls
  ) {
    return isNaN(+value)
      ? message
        ? message
        : "Needs to be a number"
      : checkForMinMax(options, +value) ? null : "The number must be between " + options.min + " and " + options.max;
  };
}
static test(pattern, message) {
  return function(
    value,
    controls
) {
    console.log('value - value', value, pattern, pattern.test(value));
    if(pattern.test(value)) {
      console.log(null);
      return null;
    }
    console.log(pattern.test(value), 'Invalid Pattern');
    return message ?? 'Invalid Pattern';
    // return pattern.test(value) ? null : (message ? message : "Invalid Pattern");
  };
}
}


class FormControlBase {
  _value = "";
  get value() {
    return this._value;
  }

  _dirty = false;
  get dirty() {
    return this._dirty;
  }

  _touched = false;
  get touched() {
    return this._touched;
  }

  name;

  _disabled= false;
  get disabled() {
    return this._disabled;
  }

  _validators = [];
  get validators() {
    return this._validators;
  }

  constructor(name) {
    this.name = name;
  }
}

export class FormControl extends FormControlBase {
  update;
  _init;

  constructor(
    name,
    control,
    update
) {
  super(name);
  this._value = control[0];
  this._validators = control[1] ? control[1] : [];
  this._init = control[0];
  this.update = update;
}
setErrors(error) {
  this.update({});
  return this;
}
reset() {
    this.patchValue(this._init);
}
setDirty(value) {
  this._dirty = value;
  this.update({});
  return this;
}
setTouched(value) {
  this._touched = value;
  this.update({});
  return this;
}
addValidators(...fn) {
    this._validators = [...this._validators, ...fn];
    this.update({});
}
patchValue(value) {
  if(value) this._value = value;
  else this._value = '';
  this.update({});
  return this;
}
}


class Form {
  controls = {};
  errors = {};
  _invalid = false;
  update;
  _init;

  constructor(
    init,
    update
) {
    this.update = update;
    Object.keys(init).forEach((key) => {
      this.controls[key] = new FormControl(key, init[key], update);
    });
    this._init = init;
  }
  get(controlName) {
    return this.controls[controlName];
  }

  reset() {
    for(let control in this.controls) {
      this.controls[control].reset();
    }
  }

  registerControl(controlName, control) {
    this.controls[controlName] = new FormControl(
      controlName,
      control,
      this.update
    );
    this.update({});
    return this.controls[controlName];
  }

  removeControl(controlName) {
    delete this.controls[controlName]
    this.update({});
  }

  validate(controls) {
    const ctrls = controls ?? this.controls;
    const controlNames = Object.keys(ctrls);

    // console.log('ctrls - ', ctrls);

    let hasError = false;
    for (let i = 0; i < controlNames.length; i++) {
      const key = controlNames[i];
      for (let j = 0; j < ctrls[key]?.validators.length; j++) {
        const validatorFn = ctrls[key]?.validators[j];
        let errorMsg = validatorFn(ctrls[key]?.value, ctrls);
        ctrls[key].setErrors(errorMsg);
        this.errors[key] = errorMsg;
        if (errorMsg) {
          hasError = true;
          break;
        }
      }
    }
    // console.log('this._invalid - ', this._invalid, hasError);
    this._invalid = hasError;
    this.update({});
  }
}

const useForm = function(
  init
) {
  const [, updateState] = useState();
  const [changeIndex, setChangeIndex] = useState(0);
  const [form, setForm] = useState(() => {
    return new Form(init, updateState);
  });
  const prevInit = useRef(null);

  useEffect(() => {
    if (JSON.stringify(prevInit.current) !== JSON.stringify(init)) {
      setForm(new Form(init, updateState));
      prevInit.current = init;
    }
  }, [init, prevInit]);

  useEffect(() => {
    if(!form) return;
    form.validate(form.controls);
  }, [form])

  const handleChange = useCallback(
    (e) => {
      setChangeIndex(c => c+1);
      if(!form.get(e.target.name) || form.get(e.target.name)._value === e.target.value || (!e.target.value && form.get(e.target.name)?._value?.length === 0)) return;
      form.get(e.target.name).patchValue(e.target.value);
      form.validate(form.controls);
    },
    [form]
  );

  const handleBlur = useCallback(
    (e) => {
      if(!form.get(e.target.name)) return;
      form.get(e.target.name).setTouched(true);
      form.validate();
      // console.log(form.get(e.target.name).value);
      // setForm(form);
      // forceUpdate();
    },
    [form]
  );

  const register = useCallback(
    (controlName) => ({
      name: controlName,
      value: form.get(controlName)?.value,
      onChange: handleChange,
    // onBlur: handleBlur
  }),
    [form, handleChange, handleBlur]
  );

  const handleChangeValue = useCallback((name, value) => handleChange({target: {name, value}}), [handleChange]);

  return { form, register, changeIndex, handleChange, handleChangeValue, updateState };
};

export default useForm;

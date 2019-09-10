import * as React from 'react';

import {
  FormElement,
  FormModel,
  FieldError,
  SelectOption,
  SelectFormElement,
} from '../types';

import Input from './elements/Input';
import DateInput from './elements/DateInput';
import SelectInput from './elements/SelectInput';
import CheckInput from './elements/CheckInput';
import GrafanaInput from './elements/GrafanaInput';
import GrafanaSelectInput from './elements/GrafanaSelectInput';
 
export function InputFactory(
  element: FormElement,
  object: FormModel,
  fieldError: FieldError | null,
  onInputChange: any,
  onBlur: any
) {
  return (
    <Input
      key={element.name}
      object={object}
      fieldError={fieldError}
      constraint={element.constraint}
      label={element.label}
      name={element.name}
      className={element.className}
      onChange={onInputChange}
      onBlur={onBlur}
    />
  );
}

export function DateInputFactory(
  element: FormElement,
  object: FormModel,
  fieldError: FieldError | null,
  onInputChange: any,
  onBlur: any
) {
  return (
    <DateInput
      key={element.name}
      object={object}
      fieldError={fieldError}
      label={element.label}
      name={element.name}
      onChange={onInputChange}
      onBlur={onBlur}
    />
  );
}

export function SelectInputFactory(
  element: SelectFormElement,
  object: FormModel,
  fieldError: FieldError | null,
  onInputChange: any,
  onBlur: any
) {
  return (
    <SelectInput
      key={element.name}
      options={element.options}
      object={object}
      fieldError={fieldError}
      label={element.label}
      name={element.name}
      onChange={onInputChange}
      onBlur={onBlur}
    />
  );
}

export function GrafanaInputFactory(
  element: FormElement,
  object: FormModel,
  fieldError: FieldError | null,
  onInputChange: any,
  onBlur: any
) {
  return (
    <GrafanaInput
      key={element.name}
      object={object}
      fieldError={fieldError}
      constraint={element.constraint}
      label={element.label}
      name={element.name}
      className={element.className}
      onChange={onInputChange}
      onBlur={onBlur}
    />
  );
}

export function GrafanaSelectInputFactory(
  element: SelectFormElement,
  object: FormModel,
  fieldError: FieldError | null,
  onInputChange: any,
  onBlur: any
) {
  return (
    <GrafanaSelectInput
      key={element.name}
      options={element.options}
      object={object}
      fieldError={fieldError}
      label={element.label}
      name={element.name}
      onChange={onInputChange}
      onBlur={onBlur}
      className={element.className}
    />
  );
}


export function CheckInputFactory(
  element: FormElement,
  object: FormModel,
  fieldError: FieldError | null,
  onInputChange: any,
  onBlur: any
) {
  return (
    <CheckInput
      key={element.name}
      object={object}
      fieldError={fieldError}
      constraint={element.constraint}
      label={element.label}
      name={element.name}
      className={element.className}
      onChange={onInputChange}
      onBlur={onBlur}
    />
  );
}

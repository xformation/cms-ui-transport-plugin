import * as React from "react";

import { FieldError, InputChangeHandler, SelectOption } from "../../types";

import FieldFeedbackPanel from "./FieldFeedbackPanel";

export default ({
  object,
  fieldError,
  name,
  label,
  options,
  onChange,
  onBlur,
  className
}: {
  object: any;
  fieldError: FieldError | null;
  name: string;
  label: string;
  options: SelectOption[];
  onChange: InputChangeHandler;
  className: string;
  onBlur: (x: string) => void;
}) => {
  const handleOnChange = (event: React.SyntheticEvent<HTMLSelectElement>) => {
    const value = event.currentTarget.value;
    onChange(name, value);
  };

  const selectedValue = object[name] || "";
  const valid = !fieldError && selectedValue !== "";

  const cssGroup = `form-group ${fieldError ? "has-error" : ""}`;

  return (
    <div className={className}>
      <label className="gf-form-label b-0 bg-transparent">{label}</label>
      <select className="gf-form-select-box select-fWidth" name={name} onChange={handleOnChange} onBlur={e => onBlur(e.currentTarget.name)} value={selectedValue}>
        <option value="" key="">{`Select ${name}`}</option>
        {options.map(option =>
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        )}
      </select>
      <FieldFeedbackPanel valid={valid} fieldError={fieldError} />
    </div>
  );
};

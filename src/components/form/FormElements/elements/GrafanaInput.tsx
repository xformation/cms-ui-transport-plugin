import * as React from 'react';

import { Constraint, FieldError, InputChangeHandler } from '../../types';

import FieldFeedbackPanel from './FieldFeedbackPanel';

const NoConstraint: Constraint = {
    message: '',
    validate: v => true,
};

type InputProps = {
    object: any;
    fieldError: FieldError | null;
    name: string;
    className: string;
    constraint: Constraint;
    label: string;
    onChange: InputChangeHandler;
    onBlur: (name: string) => void;
};

const Input = ({
    object,
    fieldError,
    name,
    className,
    constraint = NoConstraint,
    label,
    onChange,
    onBlur,
}: InputProps) => {
    const handleOnChange = (event: React.SyntheticEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget;
        onChange(name, value);
    };

    const value = object[name];
    const valid = !fieldError && value !== null && value !== undefined;

    const cssGroup = `form-group ${fieldError ? 'has-error' : ''}`;

    return (
        <div className={className}>
            <label className="gf-form-label b-0 bg-transparent">{label}</label>
            <input
                type="text"
                name={name}
                className="gf-form-input"
                value={value}
                onChange={handleOnChange}
                onBlur={e => onBlur(e.currentTarget.name)}
            />
            <FieldFeedbackPanel valid={valid} fieldError={fieldError} />
        </div>
    );
};

export default Input;

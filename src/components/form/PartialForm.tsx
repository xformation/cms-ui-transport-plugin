import * as React from 'react';
import { FieldErrors, FormModel, FormElement, SelectFormElement } from './types';

type PartialFormProps<MODEL extends FormModel> = {
    formElements: Array<any>;
    modelData: MODEL,
    className: any,
    onChange: any
};

type PartialFormStates<MODEL extends FormModel> = {
    model: MODEL;
    visitedFields: any;
    globalFormError?: string | null;
};

export default class PartialForm<MODEL extends FormModel> extends React.Component<
    PartialFormProps<MODEL>,
    PartialFormStates<MODEL>
    > {
    constructor(props: any) {
        super(props);
        const { modelData } = props;
        this.state = {
            model: {
                ...modelData
            },
            visitedFields: {},
            globalFormError: null
        };
    }

    onInputChange = (name: string, value: string) => {
        const { model, visitedFields } = this.state as any;
        let modelData = this.props.modelData as any;
        this.setState({
            model: {
                ...model,
                [name]: value
            },
            visitedFields: {
                ...visitedFields,
                [name]: true
            },
            globalFormError: null,
        });
        this.props.onChange(name, value);
    }

    onBlur = (name: string) => {
        const { visitedFields } = this.state as any;
        this.setState({
            // track that the field has been visited
            visitedFields: {
                ...visitedFields,
                [name]: true
            },
            globalFormError: null,
        });
    }

    validateCurrentModel = () => {
        const { model, visitedFields } = this.state as any;
        const { formElements } = this.props as any;
        const result: FieldErrors = {};
        formElements.forEach((element: any) => {
            const { name, constraint } = element;
            if (visitedFields[name]) {
                if (!constraint.validate(model[name])) {
                    result[name] = {
                        field: name,
                        message: constraint.message,
                    };
                }
            }
        });

        return result;
    }

    renderElements = () => {
        const { model } = this.state as any;
        const { formElements } = this.props as any;
        const fieldErrors = this.validateCurrentModel();
        let fields = formElements.map((element: any) =>
            element.elementComponentFactory(
                element,
                model,
                fieldErrors[element.name] || null,
                this.onInputChange,
                this.onBlur
            )
        );
        return fields;
    }

    render() {
        const { globalFormError } = this.state as any;
        const { className } = this.props as any;
        return (
            <div className="form-container">
                <div className={className}>
                    {
                        this.renderElements()
                    }
                </div>
                {globalFormError && (
                    <div className="alert alert-danger" role="alert">
                        {globalFormError}
                    </div>
                )}
            </div>
        );
    }
}

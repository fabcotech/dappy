import Ajv from 'ajv';

export interface ValidationError {
    dataPath: string;
    message: string;
}
  
export const validate = (jsonSchema: any) => (obj: object): ValidationError[] | undefined => {
    const ajv = new Ajv();
    const validator = ajv.compile(jsonSchema);

    if (!validator(obj)) {
        return validator.errors as ValidationError[];
    }
}
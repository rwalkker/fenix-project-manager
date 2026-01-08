import { Request, Response, NextFunction } from 'express';
/**
 * Validation schema interface
 */
export interface ValidationSchema {
    [key: string]: {
        type: 'string' | 'number' | 'boolean' | 'object' | 'array';
        required?: boolean;
        minLength?: number;
        maxLength?: number;
        min?: number;
        max?: number;
        enum?: any[];
        pattern?: RegExp;
    };
}
/**
 * Validate request body against schema
 */
export declare function validateRequest(schema: ValidationSchema): (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=validate-request.d.ts.map
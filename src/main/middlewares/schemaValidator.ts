import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import autobind from 'autobind-decorator';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { JSONSchema4, JSONSchema6, JSONSchema7 } from 'json-schema';

export type SchemaType = JSONSchema4 | JSONSchema6 | JSONSchema7;

@autobind
export class SchemaValidator {
  private ajv: Ajv;

  constructor() {
    this.ajv = new Ajv();
    addFormats(this.ajv);
  }

  public check(schema: SchemaType): RequestHandler {
    return (req: Request, res: Response, next: NextFunction) => {
      const validate = this.ajv.compile(schema);
      if (validate(req.body)) {
        next();
      } else {
        return res.status(400).json({ error: validate.errors });
      }
    };
  }
}

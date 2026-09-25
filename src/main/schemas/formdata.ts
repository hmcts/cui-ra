import { SchemaType } from './../middlewares';
//import nunjucks so we can return translation error messages

export enum errorTypes {
  empty = 'empty',
  long = 'long',
}

export function formData(): SchemaType {
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: {
      enabled: { type: 'array' },
      selected: { type: 'string' },
    },
    anyOf: [
      {
        properties: {
          enabled: { type: 'array', minItems: 1 },
        },
        required: ['enabled'],
        errorMessage: errorTypes.empty,
      },
      {
        properties: {
          selected: { type: 'string' },
        },
        required: ['selected'],
        errorMessage: errorTypes.empty,
      },
    ],
    errorMessage: errorTypes.empty,
  };
}

export function checkboxSchema(): SchemaType {
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: {
      _flagComment: { type: 'boolean' },
      _enabled: { type: 'boolean' },
      _isCategoryPage: { type: 'boolean' },
      value: {
        type: 'object',
        properties: {
          flagComment: {
            type: 'string',
          },
          flagComment_cy: {
            type: 'string',
          },
        },
      },
    },
    required: ['_flagComment', '_enabled', '_isCategoryPage', 'value'],
    if: {
      properties: {
        _enabled: { const: true },
        _flagComment: { const: true },
        _isCategoryPage: { const: false },
      },
    },
    then: {
      properties: {
        value: {
          type: 'object',
          properties: {
            flagComment: {
              type: 'string',
              minLength: 1,
              maxLength: 200,
              errorMessage: {
                minLength: errorTypes.empty,
                maxLength: errorTypes.long,
              },
            },
            flagComment_cy: {
              type: 'string',
              minLength: 1,
              maxLength: 200,
              errorMessage: {
                minLength: errorTypes.empty,
                maxLength: errorTypes.long,
              },
            },
          },
        },
      },
    },
    anyOf: [
      {
        properties: {
          value: {
            type: 'object',
            required: ['flagComment'],
          },
        },
      },
      {
        properties: {
          value: {
            type: 'object',
            required: ['flagComment_cy'],
          },
        },
      },
    ],
  };
}

export function radioSchema(): SchemaType {
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: {
      _enabled: { type: 'boolean' },
      _isCategoryPage: { type: 'boolean' },
      value: {
        type: 'object',
        properties: {
          subTypeValue: {
            type: 'string',
          },
          subTypeValue_cy: {
            type: 'string',
          },
        },
      },
    },
    required: ['_enabled', '_isCategoryPage', 'value'],
    if: {
      properties: {
        _enabled: { const: true },
        _isCategoryPage: { const: true },
      },
    },
    then: {
      properties: {
        value: {
          type: 'object',
          properties: {
            subTypeValue: {
              type: 'string',
              minLength: 1,
              maxLength: 80,
              errorMessage: {
                minLength: errorTypes.empty,
                maxLength: errorTypes.long,
              },
            },
            subTypeValue_cy: {
              type: 'string',
              minLength: 1,
              maxLength: 80,
              errorMessage: {
                minLength: errorTypes.empty,
                maxLength: errorTypes.long,
              },
            },
          },
        },
      },
    },
    anyOf: [
      {
        properties: {
          value: {
            type: 'object',
            properties: {
              subTypeValue: {
                type: 'string',
                minLength: 1,
                maxLength: 80,
                errorMessage: {
                  minLength: errorTypes.empty,
                  maxLength: errorTypes.long,
                },
              },
            },
            required: ['subTypeValue'],
            errorMessage: {
              required: {
                subTypeValue: errorTypes.empty,
                subTypeValue_cy: errorTypes.empty,
              },
            },
          },
        },
      },
      {
        properties: {
          value: {
            type: 'object',
            required: ['subTypeValue_cy'],
          },
        },
        errorMessage: {
          required: {
            subTypeValue: errorTypes.empty,
            subTypeValue_cy: errorTypes.empty,
          },
        },
      },
    ],
  };
}

export function typeaheadSchema(): SchemaType {
  return radioSchema();
}

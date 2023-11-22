import { SchemaType } from './../middlewares';

export const detailsSchema: SchemaType = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
      },
      value: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          name_cy: {
            type: 'string',
          },
          dateTimeModified: {
            type: 'string',
          },
          dateTimeCreated: {
            type: 'string',
          },
          path: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                },
                id: {
                  type: 'string',
                },
              },
            },
          },
          otherDescription: {
            type: 'string',
          },
          otherDescription_cy: {
            type: 'string',
          },
          flagComment: {
            type: 'string',
          },
          flagComment_cy: {
            type: 'string',
          },
          flagUpdateComment: {
            type: 'string',
          },
          hearingRelevant: {
            type: 'string',
            enum: ['Yes', 'No'],
          },
          flagCode: {
            type: 'string',
          },
          status: {
            type: 'string',
          },
          availableExternally: {
            type: 'string',
            enum: ['Yes', 'No'],
          },
          subTypeValue: {
            type: 'string',
          },
          subTypeValue_cy: {
            type: 'string',
          },
          subTypeKey: {
            type: 'string',
          },
        },
        required: [
          'name',
          'name_cy',
          'dateTimeCreated',
          'path',
          'flagCode',
          'status',
          'availableExternally',
          'hearingRelevant',
        ],
        additionalProperties: false,
      },
    },
    required: ['id', 'value'],
    additionalProperties: false,
  },
};

export const existingFlagsSchema: SchemaType = {
  type: 'object',
  properties: {
    partyName: {
      type: 'string',
    },
    roleOnCase: {
      type: 'string',
    },
    details: detailsSchema,
  },
  required: ['partyName', 'roleOnCase'],
  additionalProperties: false,
};

export const InboundPayloadSchema: SchemaType = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  properties: {
    callbackUrl: {
      type: 'string',
    },
    logoutUrl: {
      type: ['string', 'null'],
    },
    hmctsServiceId: {
      type: 'string',
    },
    masterFlagCode: {
      type: 'string',
    },
    correlationId: {
      type: 'string',
    },
    language: {
      type: 'string',
    },
    existingFlags: existingFlagsSchema,
  },
  required: ['callbackUrl', 'hmctsServiceId', 'masterFlagCode', 'correlationId', 'existingFlags'],
  additionalProperties: false,
};

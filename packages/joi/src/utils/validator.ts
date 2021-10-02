import * as Joi from '@hapi/joi';

/**
 * Validates data against a joi schema.
 * @param data - Data to validate against.
 * @param schema - Joi schema.
 */
 export const validateJoiSchema = <T>(data: T, schema: Joi.Schema): void =>
 Joi.validate(data, schema, (err, value) => {
   if (err) {
     throw err;
   }
   if (!value) {
     throw new Error('No value to check schema');
   }
 });

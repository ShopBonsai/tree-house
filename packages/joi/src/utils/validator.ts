import * as Joi from 'joi';

/**
 * Validates data against a joi schema.
 * @param data - Data to validate against.
 * @param schema - Joi schema.
 */
export const validateJoiSchema = <T>(data: T, schema: Joi.Schema): void => {
  const { error, value } = schema.validate(data);

  if (error) {
    throw error;
  }

  if (!value) {
    throw new Error('No value to check schema');
  }
};

'use strict';

import { getDBConnection } from '../database/db';
import { ActivityPostBody } from '../models/activity';
import { postActivitySQL } from '../queries/activity-queries';
import { ParameterizedQuery } from '../queries/query-types';
import { getLogger } from '../utils/logger';
import { sendResponse } from '../utils/query-actions';
import { validateSwaggerObject } from '../utils/controller-utils';
import { ValidationErrorType, IValidatorConfig } from 'swagger-object-validator';

const defaultLog = getLogger('observation-controller');

/**
 * Authenticated route handler for OPTIONS
 *
 * @param {*} args
 * @param {*} res
 * @param {*} next
 */
exports.authenticatedOptions = async function (args: any, res: any, next: any) {
  res.status(200).send();
};

/**
 * Authenticated route handler for POST
 *
 * @param {*} args
 * @param {*} res
 * @param {*} next
 * @returns response containing the newly created activity record.
 */
exports.authenticatedPost = async function (args: any, res: any, next: any) {
  try {
    defaultLog.debug({ label: 'authenticatedPost', message: 'params', arguments: args.swagger.params });


    let config: IValidatorConfig = {
      ignoreError: (error: { errorType: ValidationErrorType; trace: { stepName: string; }[]; }, value: string, schema: { type: string; }, spec: any) => {
        // ignore type mismatches on Pet/id when a certain value occures
        return error.errorType === ValidationErrorType.ADDITIONAL_PROPERTY
          && error.trace[0].stepName.includes('activityTypeData')
      }
  };

    const validationResult = await validateSwaggerObject(args.swagger.params.postBody.value, 'ActivityPostBody', config, './src/swagger/swagger.yaml' );

    if (validationResult.errors) {
      defaultLog.warn({
        label: 'authenticatedPost',
        message: validationResult.message,
        'post body params were invalid': validationResult.errors
      });
      return sendResponse(res, 400, { 'post body params were invalid': validationResult.errors });
    }

    const data: ActivityPostBody = args.swagger.params.postBody.value;

    const sanitizedActivityData = new ActivityPostBody(data);
    sanitizedActivityData.activityPostBody = args.swagger.params.postBody.value;

    const connection = await getDBConnection();

    if (!connection) {
      return sendResponse(res, 503);
    }

    const parameterizedQuery: ParameterizedQuery = postActivitySQL(sanitizedActivityData);

    if (!parameterizedQuery) {
      return sendResponse(res, 400);
    }

    const response = await connection.query(parameterizedQuery.sql, parameterizedQuery.values);

    const result = (response && response.rows && response.rows[0]) || null;

    connection.release();

    return sendResponse(res, 200, result);
  } catch (error) {
    defaultLog.error({ label: 'authenticatedPost', message: 'unexpected error', error });
    return sendResponse(res, 500);
  }
};

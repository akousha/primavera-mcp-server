/**
 * Function to query tables data from the Primavera Data Service.
 *
 * @param {Object} args - Arguments for the query.
 * @param {string} args.name - The name/description for this query.
 * @param {string} args.tables - The tables to query, including their names, columns, and conditions.
 * @param {string} [args.sinceDate] - Filter data since this date (format: DD-MON-YYYY HH24:MI:SS).
 * @param {boolean} [args.sqlQueriesAndTotalRecordCount] - Whether to include SQL queries and record counts.
 * @param {string} [args.pageSize] - The page size for pagination.
 * @param {string} [args.nextTableName] - The next table name for pagination.
 * @param {string} [args.nextKey] - The next key for pagination.
 * @param {boolean} [args.originalDateFormat] - Whether to use original date format.
 * @param {string} [args.mode] - The query mode (SYNC or ASYNC).
 * @returns {Promise<Object>} - The result of the query.
 */
const executeFunction = async ({ 
  name,
  tables, 
  sinceDate,
  sqlQueriesAndTotalRecordCount = true,
  pageSize,
  nextTableName,
  nextKey,
  originalDateFormat,
  mode = 'SYNC'
}) => {
  const baseUrl = 'https://ca1.p6.oraclecloud.com/metrolinx/pds/rest-service';
  const username = process.env.PRIMAVERA_DATA_SERVICE_VERSION_24_REQUEST_QUERY_TABLES_DATA_NAVYQ6YB_USERNAME
  const password = process.env.PRIMAVERA_DATA_SERVICE_VERSION_24_REQUEST_QUERY_TABLES_DATA_BVXPQTEL_PASSWORD
  
  try {
    const url = `${baseUrl}/dataservice/runquery?configCode=ds_p6reportuser`;
    
    // Build request body according to API schema
    const requestBody = {
      name: name || 'Data Query',
      tables,
      sqlQueriesAndTotalRecordCount,
      mode
    };
    
    // Add optional parameters if provided
    if (sinceDate) requestBody.sinceDate = sinceDate;
    if (pageSize) requestBody.pageSize = pageSize;
    if (nextTableName) requestBody.nextTableName = nextTableName;
    if (nextKey) requestBody.nextKey = nextKey;
    if (originalDateFormat !== undefined) requestBody.originalDateFormat = originalDateFormat;
    
    const body = JSON.stringify(requestBody);    // Set up headers for the request
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(JSON.stringify(errorData));
    }

    // Parse and return the response data
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error querying tables data:', error);
    return {
      error: `An error occurred while querying tables data: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for querying tables data from the Primavera Data Service.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'query_tables_data',
      description: 'Query tables data from the Primavera Data Service.',
      parameters: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            description: 'The name/description for this query (e.g., "OBS Data Query", "Activity Data").'
          },
          tables: {
            type: 'array',
            items: {
              type: 'object'
            },
            description: 'The tables to query, including their names, columns, conditions, and orderByColumns.'
          },
          sinceDate: {
            type: 'string',
            description: 'Filter data since this date. Format: DD-MON-YYYY HH24:MI:SS (e.g., "17-NOV-2025 01:00:18").'
          },
          sqlQueriesAndTotalRecordCount: {
            type: 'boolean',
            description: 'Whether to include SQL queries and total record count in the response. Default: true.'
          },
          pageSize: {
            type: 'string',
            description: 'The page size for pagination.'
          },
          nextTableName: {
            type: 'string',
            description: 'The next table name for pagination.'
          },
          nextKey: {
            type: 'string',
            description: 'The next key for pagination.'
          },
          originalDateFormat: {
            type: 'boolean',
            description: 'Whether to use original date format.'
          },
          mode: {
            type: 'string',
            enum: ['SYNC', 'ASYNC'],
            description: 'The query mode. Default: SYNC.'
          }
        },
        required: ['name', 'tables']
      }
    }
  }
};

export { apiTool };
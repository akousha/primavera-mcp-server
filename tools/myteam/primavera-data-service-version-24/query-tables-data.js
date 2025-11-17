/**
 * Function to query tables data from the Primavera Data Service.
 *
 * @param {Object} args - Arguments for the query.
 * @param {string} args.tables - The tables to query, including their names, columns, and conditions.
 * @param {Object} args.binds - The bind variables for the query.
 * @returns {Promise<Object>} - The result of the query.
 */
const executeFunction = async ({ tables, binds }) => {
  const baseUrl = 'https://ca1.p6.oraclecloud.com/metrolinx/pds/rest-service';
  const username = process.env.PRIMAVERA_DATA_SERVICE_VERSION_24_REQUEST_QUERY_TABLES_DATA_NAVYQ6YB_USERNAME
  const password = process.env.PRIMAVERA_DATA_SERVICE_VERSION_24_REQUEST_QUERY_TABLES_DATA_BVXPQTEL_PASSWORD

  try {
    const url = `${baseUrl}/dataservice/runquery?configCode=ds_p6adminuser`;
    
    const body = JSON.stringify({ tables, binds });

    // Set up headers for the request
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
          tables: {
            type: 'array',
            items: {
              type: 'object'
            },
            description: 'The tables to query, including their names, columns, and conditions.'
          },
          binds: {
            type: 'object',
            description: 'The bind variables for the query.'
          }
        },
        required: ['tables', 'binds']
      }
    }
  }
};

export { apiTool };
/**
 * Function to get columns metadata of a specified table from the Primavera Data Service.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.tableName - The name of the table to fetch metadata for.
 * @param {string} args.configCode - The configuration name.
 * @returns {Promise<Object>} - The columns metadata of the specified table.
 */
const executeFunction = async ({ tableName, configCode }) => {
  const baseUrl = 'https://ca1.p6.oraclecloud.com/metrolinx/pds/rest-service';
  const username = process.env.PRIMAVERA_DATA_SERVICE_VERSION_24_REQUEST_GET_COLUMNS_METADATA_OF_TABLE_D5SKMEFD_USERNAME
  const password = process.env.PRIMAVERA_DATA_SERVICE_VERSION_24_REQUEST_GET_COLUMNS_METADATA_OF_TABLE_HVMFNRIY_PASSWORD

  try {
    // Construct the URL with the table name and query parameters
    const url = `${baseUrl}/dataservice/metadata/columns/${tableName}?configCode=${configCode}`;

    // Set up headers for the request
    const headers = {
      'Accept': 'application/json',
      'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'GET',
      headers
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
    console.error('Error fetching columns metadata:', error);
    return {
      error: `An error occurred while fetching columns metadata: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for getting columns metadata of a table from the Primavera Data Service.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_columns_metadata',
      description: 'Fetch columns metadata of a specified table.',
      parameters: {
        type: 'object',
        properties: {
          tableName: {
            type: 'string',
            description: 'The name of the table to fetch metadata for.'
          },
          configCode: {
            type: 'string',
            description: 'The configuration name.'
          }
        },
        required: ['tableName', 'configCode']
      }
    }
  }
};

export { apiTool };
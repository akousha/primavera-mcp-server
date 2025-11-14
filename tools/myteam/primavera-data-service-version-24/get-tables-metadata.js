/**
 * Function to get tables metadata from the Primavera Data Service.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.configCode - The configuration name for which to fetch tables metadata.
 * @returns {Promise<Object>} - The result of the tables metadata request.
 */
const executeFunction = async ({ configCode }) => {
  const baseUrl = 'https://ca1.p6.oraclecloud.com/metrolinx/pds/rest-service';
  const username = process.env.PRIMAVERA_DATA_SERVICE_VERSION_24_REQUEST_GET_TABLES_METADATA_MVFBDKEN_USERNAME
  const password = process.env.PRIMAVERA_DATA_SERVICE_VERSION_24_REQUEST_GET_TABLES_METADATA_PR4UN_PW_PASSWORD

  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/dataservice/metadata/tables`);
    url.searchParams.append('configCode', configCode);

    // Set up headers for the request
    const headers = {
      'Accept': 'application/json',
      'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
    };

    // Perform the fetch request
    const response = await fetch(url.toString(), {
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
    console.error('Error fetching tables metadata:', error);
    return {
      error: `An error occurred while fetching tables metadata: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for getting tables metadata from Primavera Data Service.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'get_tables_metadata',
      description: 'Fetch tables metadata for specified configuration name.',
      parameters: {
        type: 'object',
        properties: {
          configCode: {
            type: 'string',
            description: '(Required) The configuration name.'
          }
        },
        required: ['configCode']
      }
    }
  }
};

export { apiTool };
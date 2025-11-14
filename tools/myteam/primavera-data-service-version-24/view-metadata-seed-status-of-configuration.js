/**
 * Function to view the metadata seed status of a configuration in Primavera Data Service.
 *
 * @param {Object} args - Arguments for the request.
 * @param {string} args.configCode - The configuration name (required).
 * @returns {Promise<Object>} - The response containing the seed status of the configuration.
 */
const executeFunction = async ({ configCode }) => {
  const baseUrl = 'https://ca1.p6.oraclecloud.com/metrolinx/pds/rest-service';
  const username = process.env.PRIMAVERA_DATA_SERVICE_VERSION_24_REQUEST_VIEW_METADATA_SEED_STATUS_OF_CONFIGURATION_HKGRJIOC_USERNAME
  const password = process.env.PRIMAVERA_DATA_SERVICE_VERSION_24_REQUEST_VIEW_METADATA_SEED_STATUS_OF_CONFIGURATION_MYPE207S_PASSWORD

  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/v1/config/status/seed`);
    url.searchParams.append('configCode', configCode);

    // Set up headers for the request
    const headers = {
      'Accept': 'text/plain',
      'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
    };

    // Perform the fetch request
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(errorData);
    }

    // Parse and return the response data
    const data = await response.text();
    return data;
  } catch (error) {
    console.error('Error viewing metadata seed status:', error);
    return {
      error: `An error occurred while viewing metadata seed status: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for viewing metadata seed status of a configuration in Primavera Data Service.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'view_metadata_seed_status',
      description: 'View the metadata seed status of a configuration in Primavera Data Service.',
      parameters: {
        type: 'object',
        properties: {
          configCode: {
            type: 'string',
            description: 'The configuration name.'
          }
        },
        required: ['configCode']
      }
    }
  }
};

export { apiTool };
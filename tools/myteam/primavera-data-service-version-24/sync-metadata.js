/**
 * Function to sync P6/Unifier Metadata with Primavera Data Service.
 *
 * @param {Object} args - Arguments for the sync operation.
 * @param {string} args.configCode - The configuration name (required).
 * @returns {Promise<Object>} - The result of the sync operation.
 */
const executeFunction = async ({ configCode }) => {
  const baseUrl = 'https://ca1.p6.oraclecloud.com/metrolinx/pds/rest-service';
  const username = process.env.PRIMAVERA_DATA_SERVICE_VERSION_24_REQUEST_SYNC_METADATA_PX1SFB8R_USERNAME
  const password = process.env.PRIMAVERA_DATA_SERVICE_VERSION_24_REQUEST_SYNC_METADATA_BSADL03P_PASSWORD

  try {
    // Construct the URL with query parameters
    const url = new URL(`${baseUrl}/dataservice/metadata/refresh`);
    url.searchParams.append('configCode', configCode);

    // Set up headers for the request
    const headers = {
      'Accept': 'application/json',
      'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
    };

    // Perform the fetch request
    const response = await fetch(url.toString(), {
      method: 'POST',
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
    console.error('Error syncing metadata:', error);
    return {
      error: `An error occurred while syncing metadata: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for syncing metadata with Primavera Data Service.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'sync_metadata',
      description: 'Sync P6/Unifier Metadata with Primavera Data Service.',
      parameters: {
        type: 'object',
        properties: {
          configCode: {
            type: 'string',
            description: 'The configuration name (required).'
          }
        },
        required: ['configCode']
      }
    }
  }
};

export { apiTool };
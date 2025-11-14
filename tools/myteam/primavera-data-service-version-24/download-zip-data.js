/**
 * Function to download a ZIP file using a job ID from the Primavera Data Service.
 *
 * @param {Object} args - Arguments for the download.
 * @param {string} args.jobId - The unique identifier of a scheduled job.
 * @returns {Promise<Buffer>} - The ZIP file data as a Buffer.
 */
const executeFunction = async ({ jobId }) => {
  const baseUrl = 'https://ca1.p6.oraclecloud.com/metrolinx/pds/rest-service';
  const username = process.env.PRIMAVERA_DATA_SERVICE_VERSION_24_REQUEST_DOWNLOAD_ZIP_DATA_7T7EAYKH_USERNAME
  const password = process.env.PRIMAVERA_DATA_SERVICE_VERSION_24_REQUEST_DOWNLOAD_ZIP_DATA_X9PIQHOE_PASSWORD

  try {
    // Construct the URL with the job ID
    const url = `${baseUrl}/dataservice/download/${jobId}`;

    // Set up headers for the request
    const headers = {
      'Accept': 'application/octet-stream',
      'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
    };

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'GET',
      headers
    });

    // Check if the response was successful
    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Error ${response.status}: ${errorData}`);
    }

    // Return the response as a Buffer
    const data = await response.arrayBuffer();
    return Buffer.from(data);
  } catch (error) {
    console.error('Error downloading ZIP file:', error);
    return {
      error: `An error occurred while downloading the ZIP file: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for downloading a ZIP file from the Primavera Data Service.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'download_zip_data',
      description: 'Download a ZIP file using a job ID from the Primavera Data Service.',
      parameters: {
        type: 'object',
        properties: {
          jobId: {
            type: 'string',
            description: 'The unique identifier of a scheduled job.'
          }
        },
        required: ['jobId']
      }
    }
  }
};

export { apiTool };
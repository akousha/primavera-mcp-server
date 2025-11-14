/**
 * Function to view job status in Primavera Data Service.
 *
 * @param {Object} args - Arguments for the job status request.
 * @param {Array<string>} args.jobIds - An array of job IDs to check the status.
 * @param {string} args.jobType - The type of job (e.g., "EXPORT_DATA").
 * @param {string} args.jobStatus - The status of the job (e.g., "COMPLETED_WITH_WARNINGS").
 * @returns {Promise<Object>} - The result of the job status request.
 */
const executeFunction = async ({ jobIds, jobType, jobStatus }) => {
  const baseUrl = 'https://ca1.p6.oraclecloud.com/metrolinx/pds/rest-service';
  const username = process.env.PRIMAVERA_DATA_SERVICE_VERSION_24_REQUEST_VIEW_JOB_STATUS_YF25KJKY_USERNAME
  const password = process.env.PRIMAVERA_DATA_SERVICE_VERSION_24_REQUEST_VIEW_JOB_STATUS_7ZFVGH5A_PASSWORD

  try {
    const url = `${baseUrl}/dataservice/jobStatus`;
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    // Prepare the request body
    const body = JSON.stringify({
      jobIds,
      jobType,
      jobStatus
    });

    // Perform the fetch request
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
      credentials: 'include',
      mode: 'cors',
      // Basic authentication
      headers: {
        ...headers,
        'Authorization': 'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')
      }
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
    console.error('Error viewing job status:', error);
    return {
      error: `An error occurred while viewing job status: ${error instanceof Error ? error.message : JSON.stringify(error)}`
    };
  }
};

/**
 * Tool configuration for viewing job status in Primavera Data Service.
 * @type {Object}
 */
const apiTool = {
  function: executeFunction,
  definition: {
    type: 'function',
    function: {
      name: 'view_job_status',
      description: 'View job status in Primavera Data Service.',
      parameters: {
        type: 'object',
        properties: {
          jobIds: {
            type: 'array',
            items: {
              type: 'string'
            },
            description: 'An array of job IDs to check the status.'
          },
          jobType: {
            type: 'string',
            description: 'The type of job (e.g., "EXPORT_DATA").'
          },
          jobStatus: {
            type: 'string',
            description: 'The status of the job (e.g., "COMPLETED_WITH_WARNINGS").'
          }
        },
        required: ['jobIds', 'jobType', 'jobStatus']
      }
    }
  }
};

export { apiTool };
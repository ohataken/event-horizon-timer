/**
 * event-horizon-timer-stop-timer
 * @param {Object} event event
 * @returns {Object} response
 */
export async function handler(event) { // eslint-disable-line no-unused-vars -- event
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({ message: "Not implemented" })
  };
}

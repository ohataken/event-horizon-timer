export async function handler(event) { // eslint-disable-line no-unused-vars
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html'
    },
    body: [
      '<!DOCTYPE html>',
      '<html lang="en">',
      '<head>',
      '  <meta charset="UTF-8">',
      '  <title>Event Horizon Timer</title>',
      '</head>',
      '<body>',
      '</body>',
      '</html>'
    ].join('\n')
  };
}

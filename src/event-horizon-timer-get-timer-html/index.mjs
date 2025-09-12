/**
 * event-horizon-timer-get-timer-html
 * @param {Object} event event
 * @returns {Object} response
 */
export async function handler(event) { // eslint-disable-line no-unused-vars -- event
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
      '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
      '  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css">',
      '  <script src="https://kit.fontawesome.com/6fdd8a7bbb.js" crossorigin="anonymous"></script>',
      '  <title>Event Horizon Timer</title>',
      '</head>',
      '<body>',
      '  <section class="hero is-fullheight">',
      '    <div class="hero-body">',
      '      <div class="container has-text-centered">',
      '        <p class="title is-size-1" id="timer">00:00:00</p>',
      '      </div>',
      '    </div>',
      '  </section>',
      '</body>',
      '</html>'
    ].join('\n')
  };
}

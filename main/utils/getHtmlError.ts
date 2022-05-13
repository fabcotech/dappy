export const getHtmlError = (title: string, error: string): any => {
  return `
  <html>
    <head>
      <style>
      .fc {display:flex;justify-content:center;align-items:center;}
      </style>
    </head>
    <body class="fc">
      <div style="border-radius:4px;width: 400px;height:200px;border:2px solid #666;padding: 2rem;">
      <h3 style="font-size: 2rem;">${title || 'Error'}</h3>
      <p style="font-size: 1.4rem;">${error || 'Unknown error'}</p>
      </div>
    </body>
  </html>`
};

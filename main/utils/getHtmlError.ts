export const getHtmlError = (title: string, error: string, supp?: { type: 'ip app' | 'dapp', log: string }): any => {
  return `
  <html>
    <head>
      <link rel="preconnect" href="dappyl://fonts/FiraSans-Regular.ttf" rel="stylesheet">
      <style>
      * {
        box-sizing: border-box;  
      }
      body {
        margin: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        flex-direction: column;
        align-items: center;
        height: 100vh;
        font-family: 'Fira Sans', sans-serif;
      }
      </style>
    </head>
    <body class="fc">
      <div style="margin-bottom: 10px; color: #6a6a6a; border-radius: 4px;width: 400px;height:200px;border:1px solid #ddd;padding: 2rem; background: #fafafa;">
      <h3 style="margin-top: 0px; font-weight: 300; font-size: 1.6rem;">${title || 'Error'}</h3>
      <p style="font-weight: 300; font-size: 1.2rem;">${error || 'Unknown error'}</p>
      </div>
      ${
        supp && supp.type === 'ip app' ?
        `<div style="color: #5a5a5a; border-radius: 4px;width: 400px;border:1px solid #ddd;padding: 0.5rem; background: #efefef;">
          <p>Resolved as IP application</p>
          <pre style="padding: 4px;">${supp.log}</pre>
        </div>` : ''
      }
      ${
        supp && supp.type === 'dapp' ?
        `<div style="color: #5a5a5a; border-radius: 4px;width: 400px;border:1px solid #ddd;padding: 0.5rem; background: #efefef;">
          <p>Resolved as dapp (HTML on the blockchain)</p>
          <pre style="padding: 4px;">${supp.log}</pre>
        </div>` : ''
      }
    </body>
  </html>`
};

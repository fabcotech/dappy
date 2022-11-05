export const getHtmlError = (
  title: string,
  error: string,
  supp?: { type: 'ip app' | 'dapp'; log: string }
): any => {
  return `
  <html>
    <head>
      <link rel="preconnect" href="dappyl://fonts/FiraSans-Regular.ttf" rel="stylesheet">
      <style>
        * {
          box-sizing: border-box;  
        }
        body {
          background: #111;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          height: 100vh;
          font-family: 'Fira Sans', sans-serif;
        }
        body > div.princ {
          margin-bottom: 10px;
          color: #ddd;
          border-radius: 6px;
          width: 600px;
          height: 200px;
          background: rgba(255, 255, 255, 0.1);
          box-shadow: 0px 0px 17px rgb(0 0 0 / 10%);
          padding: 2rem;
          border-image: linear-gradient(45deg, #ddd, #fff) 1;
        }
      </style>
    </head>
    <body class="fc">
      <div class="princ">
        <h3 style="margin-top: 0px; font-weight: 800; font-size: 1.5rem;">${title || 'Error'}</h3>
        <p style="font-weight: 300; font-size: 1.2rem;">${error || 'Unknown error'}</p>
      </div>
      ${
        supp && supp.type === 'ip app'
          ? `<div style="color: #ddd; background: rgba(255, 255, 255, 0.1); border-radius: 6px;width: 600px;padding: 0.5rem;">
          <p>Resolved as IP application</p>
          <pre style="padding: 4px;">${supp.log}</pre>
        </div>`
          : ''
      }
      ${
        supp && supp.type === 'dapp'
          ? `<div style="color: #5a5a5a; border-radius: 4px;width: 600px;border:1px solid #ddd;padding: 0.5rem; background: #efefef;">
          <p>Resolved as dapp (HTML on the blockchain)</p>
          <pre style="padding: 4px;">${supp.log}</pre>
        </div>`
          : ''
      }
    </body>
  </html>`;
};

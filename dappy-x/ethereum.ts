function Ethereum() {
  this.isMetaMask = false;

  this.request = function (payload: any) {
    console.log(payload.method);
    return new Promise((resolve, reject) => {
      const interProcess = new XMLHttpRequest();
      interProcess.open('POST', `interprocessdapp://${payload.method}`);
      interProcess.setRequestHeader('Data', JSON.stringify(payload));
      interProcess.send();
      interProcess.onload = (a: any) => {
        try {
          const r = JSON.parse(a.target.responseText);
          console.log(r);
          if (r.success) {
            resolve(r.data);
          } else {
            reject(r.data);
          }
        } catch (e) {
          console.log(e);
        }
      };
    });
  };
}

window.ethereum = new Ethereum();

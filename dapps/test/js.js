document.addEventListener("DOMContentLoaded", function () {
  document.body.setAttribute("style", "background: #CCC;");

  const isReactLoaded = document.getElementsByClassName("is-react-loaded")[0];
  if (!!ReactDOM) {
    isReactLoaded.innerHTML = "React is loaded";
    isReactLoaded.setAttribute("style", "color: #6A6;");
  }

  const isJavascriptEvaluated = document.getElementsByClassName(
    "is-javascript-evaluated"
  )[0];
  isJavascriptEvaluated.innerHTML = "javascript is correctly evaluated";
  isJavascriptEvaluated.setAttribute("style", "color: #6A6;");

  alert("This alert should not pop");

  const form = document.getElementById("form");
  form.submit();

  localStorage.setItem("localStorageTest", "local storage work !");
  const ls = localStorage.getItem("localStorageTest");
  if (ls) {
    document.getElementsByClassName("local-storage-works")[0].innerHTML = ls;
    document
      .getElementsByClassName("local-storage-works")[0]
      .setAttribute("style", "color: #6A6;");
  }

  window.open("https://rchain.coop/");
});

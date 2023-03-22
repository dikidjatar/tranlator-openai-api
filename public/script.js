(function () {
  const fromText = document.querySelector(".from-text");
  const toText = document.querySelector(".to-text");
  const selectTag = document.querySelector("select");
  const translateBtn = document.querySelector("button");

  for (let country_code in countries) {
    let selected =
      selectTag.id == 1 ? (country_code == "en-GB" ? "selected" : "") : "";
    let option = `<option ${selected} value="${countries[country_code]}">${countries[country_code]}</option>`;
    selectTag.insertAdjacentHTML("beforeend", option);
  }

  function terjemahkan() {
    const socket = io();
    
    socket.emit("prompt", {
      message: fromText.value,
      selectTo: selectTag.value,
    });
    
    socket.on('translate', function(message) {
      let text = message.text;
      toText.value = text;
    });
  }
  
  translateBtn.addEventListener("click", terjemahkan);
  
})();

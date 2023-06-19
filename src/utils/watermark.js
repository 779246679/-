let watermark = {};

let setWatermark = (str) => {
  let id = "1.23452384164.123412416";

  if (document.getElementById(id) !== null) {
    document.body.removeChild(document.getElementById(id));
  }

  // 创建一个画布
  let can = document.createElement("canvas");
  can.width = 150;
  can.height = 120;

  let cans = can.getContext("2d");
  cans.rotate((-20 * Math.PI) / 180);
  cans.font = "20px Vedana";
  cans.fillStyle = "rgba(200, 200, 200, 0.15)";
  cans.textAlign = "left";
  cans.textBaseline = "Middle";
  cans.fillText(str, can.width / 5, can.height / 2);

  let div = document.createElement("div");
  div.id = id;
  div.style.pointerEvents = "none";
  div.style.top = "70px";
  div.style.left = "0px";
  div.style.position = "fixed";
  div.style.zIndex = "100000";
  div.style.width = document.documentElement.clientWidth + "px";
  div.style.height = document.documentElement.clientHeight + "px";
  div.style.background =
    "url(" + can.toDataURL("image/png") + ") left top repeat";
  document.body.appendChild(div);

  // 防止修改水印 DOM 的代码
  const options = {
    childList: true,
    attributes: true,
    subtree: true,
    attributesOldValue: true,
    characterData: true,
    characterDataOldValue: true,
  };

  const reset = (expression = () => {}) => {
    setTimeout(() => {
      observer.disconnect();
      expression();
      observer.observe(div, options);
    }, 0);
  };

  const callback = (records) => {
    const record = records[0];
    if (record.type === "attributes" && record.attributeName === "style") {
      reset(() => {
        div.setAttribute(
          "style",
          "pointer-events: none; top: 70px; left: 0px; position: fixed; z-index: 100000; width: " +
            document.documentElement.clientWidth +
            "px; height: " +
            document.documentElement.clientHeight +
            "px; background: url(" +
            can.toDataURL("image/png") +
            ") left top repeat;"
        );
      });
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(div, options);

  return id;
};

// 该方法只允许调用一次
watermark.set = (str) => {
  let id = setWatermark(str);
  setInterval(() => {
    if (document.getElementById(id) === null) {
      id = setWatermark(str);
    }
  }, 500);
  window.onresize = () => {
    setWatermark(str);
  };
};

export default watermark;

(function () {
  var style = document.createElement('style');
  style.type = 'text/css';
  var cssRules = `
    .holofx-text {
      background-size: 150%;
      -webkit-text-fill-color: transparent !important;
      -webkit-background-clip: text !important;
      background-image: url('https://cdn.jsdelivr.net/gh/bizop/holofx/holo.png') !important;
    }

    .holofx-bg {
      background-size: 200% !important;
      background-image: url('https://cdn.jsdelivr.net/gh/bizop/holofx/holo.png') !important;
    }
  `;
  if (style.styleSheet) {
    style.styleSheet.cssText = cssRules;
  } else {
    style.appendChild(document.createTextNode(cssRules));
  }
  document.getElementsByTagName('head')[0].appendChild(style);

  const holographicTexts = document.querySelectorAll('.holofx-text');

  function updateHolographicText(valueX, valueY) {
    const percentage = '' + valueX * 100 + '% ' + valueY * 50 + '%';
    holographicTexts.forEach((elem) => {
      elem.style.backgroundPosition = percentage;
    });
  }

  const holographicBackgrounds = document.querySelectorAll('.holofx-bg');

  function updateHolographicBackground(valueX, valueY) {
    const percentage = '' + valueX * 100 + '% ' + valueY * 50 + '%';
    holographicBackgrounds.forEach((elem) => {
      elem.style.backgroundPosition = percentage;
    });
  }

  function handleMouseMove(event) {
    const x = event.clientX;
    const y = event.clientY;
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    const valueX = x / width;
    const valueY = y / height;
    updateHolographicText(valueX, valueY);
    updateHolographicBackground(valueX, valueY);

    const elementsToTransform = document.querySelectorAll('.holofx-transform');
    const halfW = width / 2;
    const halfH = height / 2;
    const coorX = halfW - (event.pageX - document.documentElement.offsetLeft);
    const coorY = halfH - (event.pageY - document.documentElement.offsetTop);
    const degX = (coorY / halfH) * 15 + 'deg';
    const degY = (coorX / halfW) * -15 + 'deg';

    elementsToTransform.forEach((elem) => {
      elem.style.transform = 'perspective(600px) translate3d(0, -2px, 0) scale(1) rotateX(' + degX + ') rotateY(' + degY + ')';
    });
  }

  function handleDeviceOrientation(event) {
    const z = Math.abs(event.alpha);
    const value = z / 360;
    updateHolographicBackground(value);
  }

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('deviceorientation', handleDeviceOrientation, true);
})();

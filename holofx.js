(function () {
  var style = document.createElement('style');
  style.type = 'text/css';
  var cssRules = `
    .holofx-text {
      background-size: 150%;
      -webkit-text-fill-color: transparent !important;
      -webkit-background-clip: text !important;
    }

    .holofx-bg {
      background-size: 200% !important;
    }
  `;
  if (style.styleSheet) {
    style.styleSheet.cssText = cssRules;
  } else {
    style.appendChild(document.createTextNode(cssRules));
  }
  document.getElementsByTagName('head')[0].appendChild(style);

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  canvas.width = 300;
  canvas.height = 300;
  
  function createGradient() {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, 'rgba(229, 61, 143)'); // Pink
    gradient.addColorStop(0.25, 'rgba(18, 224, 255)');   // Blue
    gradient.addColorStop(0.5, 'rgba(25, 239, 131)'); // Green
    gradient.addColorStop(0.75, 'rgba(18, 224, 255)');   // Blue
    gradient.addColorStop(1, 'rgb(212 61 229)'); // Purple
    return gradient;
  }

  // Generate the image once
  function generateImage() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = createGradient(0.5, 0.5);
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle noise effect
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 10 - 5;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i+1] = Math.max(0, Math.min(255, data[i+1] + noise));
      data[i+2] = Math.max(0, Math.min(255, data[i+2] + noise));
    }
    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL();
  }

  const dataURL = generateImage();

  function updateElements(x, y) {
    const holographicTexts = document.querySelectorAll('.holofx-text');
    holographicTexts.forEach((elem) => {
      elem.style.backgroundImage = `url(${dataURL})`;
      elem.style.backgroundPosition = `${x * 100}% ${y * 100}%`;
    });

    const holographicBackgrounds = document.querySelectorAll('.holofx-bg');
    holographicBackgrounds.forEach((elem) => {
      elem.style.backgroundImage = `url(${dataURL})`;
      elem.style.backgroundPosition = `${x * 100}% ${y * 100}%`;
      if (elem.tagName.toLowerCase() === 'button') {
        elem.style.border = 'none';
        elem.style.color = '#ffffff'; // Set button text color to white
        elem.style.position = 'relative';
        elem.style.zIndex = '1';
        elem.style.overflow = 'hidden';
      }
    });
  }

  function handleMouseMove(event) {
    const x = event.clientX;
    const y = event.clientY;
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    const valueX = x / width;
    const valueY = y / height;
    updateElements(valueX, valueY);

    const elementsToTransform = document.querySelectorAll('.holofx-transform');
    const halfW = width / 2;
    const halfH = height / 2;
    const coorX = halfW - (event.pageX - document.documentElement.offsetLeft);
    const coorY = halfH - (event.pageY - document.documentElement.offsetTop);
    const degX = (coorY / halfH) * 45 + 'deg';
    const degY = (coorX / halfW) * -45 + 'deg';

    elementsToTransform.forEach((elem) => {
      elem.style.transform = `
        perspective(1000px)
        translate3d(${coorX / 50}px, ${coorY / 50}px, 0)
        scale(1.05)
        rotateX(${degX})
        rotateY(${degY})
      `;
      elem.style.transition = 'transform 0.1s ease-out';
    });

    // Update animation values based on mouse position
    animationX = valueX;
    animationY = valueY;
  }

  function handleDeviceOrientation(event) {
    const z = Math.abs(event.alpha);
    const value = z / 360;
    updateElements(value, value);
  }

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('deviceorientation', handleDeviceOrientation, true);

  let animationX = 0.5;
  let animationY = 0.5;
  let lastUpdateTime = 0;
  function animate(currentTime) {
    if (currentTime - lastUpdateTime > 50) { // Update every 50ms
      animationX += (Math.random() - 0.5) * 0.01;
      animationY += (Math.random() - 0.5) * 0.01;
      animationX = Math.max(0, Math.min(1, animationX));
      animationY = Math.max(0, Math.min(1, animationY));
      updateElements(animationX, animationY);
      lastUpdateTime = currentTime;
    }
    requestAnimationFrame(animate);
  }

  // Initial update and start animation
  updateElements(0.5, 0.5);
  animate();
})();

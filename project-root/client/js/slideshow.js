document.addEventListener("DOMContentLoaded", function () {
    const images = ['images/index1.jpeg', 'images/index2.jpeg'];
    const section = document.getElementById('heroSection');
    const indicators = document.getElementById('imageIndicators');
    let index = 0;
  
    images.forEach((_, i) => {
      const btn = document.createElement('button');
      if (i === 0) btn.classList.add('active');
      btn.onclick = () => {
        index = i;
        updateBackground();
        resetInterval();
      };
      indicators.appendChild(btn);
    });
  
    const updateBackground = () => {
      section.style.backgroundImage = `url('${images[index]}')`;
      [...indicators.children].forEach((dot, i) =>
        dot.classList.toggle('active', i === index)
      );
    };
  
    const nextImage = () => {
      index = (index + 1) % images.length;
      updateBackground();
    };
  
    let interval = setInterval(nextImage, 5000);
    const resetInterval = () => {
      clearInterval(interval);
      interval = setInterval(nextImage, 5000);
    };
  
    updateBackground();
  });
  
  
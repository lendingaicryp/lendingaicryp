document.addEventListener('DOMContentLoaded', () => {
    const statItems = document.querySelectorAll('.stats-banner .stat-item');
    
    const animateValue = (obj, start, end, duration) => {
      let startTimestamp = null;
      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        obj.innerHTML = currentValue.toLocaleString();
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    };
  
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const statValue = entry.target.querySelector('.stat-value');
          const endValue = parseInt(entry.target.dataset.value, 10);
          animateValue(statValue, 0, endValue, 2000);
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);
  
    statItems.forEach(item => {
      observer.observe(item);
  
      // Add hover effect
      item.addEventListener('mouseenter', () => {
        item.style.transform = 'scale(1.05)';
      });
  
      item.addEventListener('mouseleave', () => {
        item.style.transform = 'scale(1)';
      });
    });
  });
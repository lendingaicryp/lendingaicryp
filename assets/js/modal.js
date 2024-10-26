document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('creditModal');
    const btn = document.getElementById('increaseAllowanceBtn');
    const closeBtn = document.getElementsByClassName('close-btn')[0];
  
    btn.onclick = function() {
      modal.style.display = 'block';
    }
  
    closeBtn.onclick = function() {
      modal.style.display = 'none';
    }
  
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    }
  });
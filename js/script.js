// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    // Prevent default behavior
    e.preventDefault();
    // Get target element by href attribute
    const targetID = this.getAttribute('href');
    const targetElement = document.querySelector(targetID);
    if(targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Basic form validation (optional enhancement)
document.getElementById('contactForm').addEventListener('submit', function(e) {
  const name = this.name.value.trim();
  const email = this.email.value.trim();
  if(name === '' || email === '') {
    e.preventDefault();
    alert('Please fill in both your name and email.');
  }
});

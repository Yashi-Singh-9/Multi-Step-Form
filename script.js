const form = document.getElementById('multiStepForm');
const steps = document.querySelectorAll('.form-step');
const progressSteps = document.querySelectorAll('.progress .circle');
const nextBtns = document.querySelectorAll('.next-btn');
const prevBtns = document.querySelectorAll('.prev-btn');
const summary = document.getElementById('summary');
const confirmation = document.getElementById('confirmation');

let currentStep = 0;

// Function to update the progress bar
function updateProgressBar() {
  progressSteps.forEach((circle, index) => {
    if (index === currentStep) {
      circle.classList.add('active');
      circle.classList.remove('completed');
    } else if (index < currentStep) {
      circle.classList.add('completed');
      circle.classList.remove('active');
    } else {
      circle.classList.remove('active', 'completed');
    }
  });

  const progressBar = document.querySelector('.progress');
  progressBar.className = `progress step-${currentStep + 1}`;
}

// Function to update the visible form steps
function updateFormSteps() {
  steps.forEach((step, index) => {
    step.classList.toggle('active', index === currentStep);
  });
  updateProgressBar();
}

// Collect form data and generate the summary
function collectSummary() {
  const formData = new FormData(form);
  const selectedSkill = document.querySelector('.skill-group.selected a');
  const selectedChallenges = Array.from(
    document.querySelectorAll('input[type="checkbox"]:checked')
  ).map(input => input.labels[0].textContent);

  summary.innerHTML = `
    <p class="info">Full Name: <strong>${formData.get('fullName')}</strong></p>
    <p class="info">Email Address: <strong>${formData.get('email')}</strong></p>
    <p class="info">Phone Number: <strong>${formData.get('phone')}</strong></p>
    <p class="info">Portfolio/GitHub: <strong>${formData.get('portfolio')}</strong></p>
    <p class="info">Skill Level: <strong>${selectedSkill ? selectedSkill.textContent.trim() : 'Not Selected'}</strong></p>
    <p class="info">Challenge Preferences: <strong>${
      selectedChallenges.length > 0 ? selectedChallenges.join(', ') : 'None Selected'
    }</strong></p>
  `;
}

// Validate email and phone number
function validateEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

function validatePhone(phone) {
  const phonePattern = /^\d+$/;
  return phonePattern.test(phone);
}

// Handle the "Next" button functionality
nextBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const inputs = steps[currentStep].querySelectorAll('input, textarea');
    let isValid = true;

    // Clear any existing error messages
    steps[currentStep].querySelectorAll('.error').forEach(error => error.remove());

    inputs.forEach(input => {
      const errorElement = document.createElement('p');
      errorElement.classList.add('error');
      errorElement.style.color = 'red';
      errorElement.style.fontSize = '12px';

      if (input.id === 'email' && !validateEmail(input.value)) {
        errorElement.innerHTML = 'Please enter a valid email address.';
        input.parentElement.appendChild(errorElement);
        isValid = false;
      } else if (input.id === 'phone' && !validatePhone(input.value)) {
        errorElement.innerHTML = 'Please enter a valid phone number (numbers only).';
        input.parentElement.appendChild(errorElement);
        isValid = false;
      } else if (!input.checkValidity()) {
        errorElement.innerHTML = input.validationMessage;
        input.parentElement.appendChild(errorElement);
        isValid = false;
      }
    });

    if (isValid) {
      currentStep++;
      if (currentStep === steps.length - 1) collectSummary();
      updateFormSteps();
    }
  });
});

// Handle the "Previous" button functionality
prevBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    currentStep--;
    updateFormSteps();
  });
});

// Handle the form submission to show confirmation
form.addEventListener('submit', (e) => {
  e.preventDefault();

  form.classList.add('hide');
  form.style.display = 'none';
  confirmation.classList.remove('hide');
  confirmation.style.display = 'block';
});

// Highlight selected skill level
document.querySelectorAll('.skill-group').forEach(skill => {
  skill.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelectorAll('.skill-group').forEach(s => s.classList.remove('selected'));
    skill.classList.add('selected');
  });
});

// Highlight selected challenge preferences
document.querySelectorAll('.challenge-group input').forEach(checkbox => {
  checkbox.addEventListener('change', (e) => {
    const parent = checkbox.closest('.challenge-group');
    if (checkbox.checked) {
      parent.classList.add('selected');
    } else {
      parent.classList.remove('selected');
    }
  });
});

// Initialize the form on page load
updateFormSteps();

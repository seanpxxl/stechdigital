const form = document.querySelector('[data-project-form]');
const submit = document.querySelector('[data-form-submit]');
const email = document.querySelector('#email');
const phone = document.querySelector('#phone');
const emailRequired = document.querySelector('[data-email-required]');
const phoneRequired = document.querySelector('[data-phone-required]');

function syncContactRequirement() {
  const selectedMethod = document.querySelector('input[name="Preferred contact"]:checked');
  const method = selectedMethod ? selectedMethod.value : 'Email';
  const needsEmail = method === 'Email';
  const needsPhone = method === 'WhatsApp' || method === 'Call';
  if (email) email.required = needsEmail;
  if (phone) phone.required = needsPhone;
  if (emailRequired) emailRequired.hidden = !needsEmail;
  if (phoneRequired) phoneRequired.hidden = !needsPhone;
}

document.querySelectorAll('input[name="Preferred contact"]').forEach((input) => {
  input.addEventListener('change', syncContactRequirement);
});
syncContactRequirement();

if (form) form.addEventListener('submit', (event) => {
  if (!form.checkValidity()) {
    event.preventDefault();
    const invalid = form.querySelector(':invalid');
    if (invalid) invalid.reportValidity();
    if (invalid) invalid.focus();
    return;
  }
  sessionStorage.setItem('stech-project-sent', 'true');
  if (localStorage.getItem('stech-analytics-consent') === 'accepted' && typeof window.gtag === 'function') {
    window.gtag('event', 'project_form_submit');
  }
  if (submit) {
    submit.disabled = true;
    submit.textContent = 'Sending…';
  }
});

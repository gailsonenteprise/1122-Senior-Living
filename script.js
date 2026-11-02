const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.classList.toggle('open', open);
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menu.setAttribute('aria-expanded', 'false');
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.classList.contains('open')) {
    nav.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); menu.focus();
  }
});
const form = document.querySelector('#interest-form');
form.addEventListener('submit', async event => {
  event.preventDefault();
  const status = document.querySelector('#form-status');
  const button = form.querySelector('button[type="submit"]');
  if (button.disabled) return;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  if (data.get('_honey')) return;
  button.disabled = true;
  form.setAttribute('aria-busy', 'true');
  status.textContent = 'Sending your inquiry…';
  try {
    const response = await fetch('https://formsubmit.co/ajax/info@1122livingestates.com', {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: data,
      signal: AbortSignal.timeout(25000)
    });
    const result = await response.json();
    if (!response.ok || !(result.success === true || result.success === 'true')) {
      throw new Error('Submission not accepted');
    }
    status.textContent = 'Thank you. Your inquiry has been submitted to 1122 Living Estates. We look forward to connecting with you.';
    form.reset();
  } catch (error) {
    status.textContent = 'We couldn’t confirm that your inquiry was sent. Your details are still here. Please try again, or email info@1122livingestates.com directly.';
  } finally {
    button.disabled = false;
    form.removeAttribute('aria-busy');
    status.focus();
  }
});

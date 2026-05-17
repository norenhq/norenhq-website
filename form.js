document.querySelectorAll('form.form').forEach((form) => {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.form-submit');
    const tagline = form.querySelector('.form-tagline');
    const originalBtnText = submitBtn.textContent;
    const originalTagline = tagline ? tagline.textContent : '';

    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';
    if (tagline) {
      tagline.textContent = originalTagline;
      tagline.style.color = '';
    }

    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(result.error || 'Submission failed');

      form.innerHTML = `
        <div class="form-success">
          <div class="form-success-mark">✓</div>
          <h3>Brief received.</h3>
          <p>We'll reply within 48 hours at <strong>${escapeHtml(data.email)}</strong>.</p>
        </div>`;
    } catch (err) {
      submitBtn.disabled = false;
      submitBtn.textContent = originalBtnText;
      if (tagline) {
        tagline.textContent = "Couldn't send. Email hello@norenhq.io instead.";
        tagline.style.color = '#8B5A1A';
      } else {
        alert("Couldn't send. Please email hello@norenhq.io directly.");
      }
    }
  });
});

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[c]);
}

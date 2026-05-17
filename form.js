document.querySelectorAll('form.form').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(form).entries());

    const lines = [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Company: ${data.company || '—'}`,
      `Product URL: ${data.url || '—'}`,
      '',
      'What did you build?',
      data.built,
      '',
      'What feels broken or messy right now?',
      data.broken,
    ];

    const subject = `New brief from ${data.name}`;
    const body = lines.join('\n');
    const mailto = `mailto:hello@norenhq.io?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;

    setTimeout(() => {
      form.innerHTML = `
        <div class="form-success">
          <div class="form-success-mark">✓</div>
          <h3>Almost there.</h3>
          <p>Your mail app should have opened with the brief ready to send.<br>If nothing happened, email us at <a href="mailto:hello@norenhq.io">hello@norenhq.io</a>.</p>
        </div>`;
    }, 600);
  });
});

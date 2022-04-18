const PollLinks = (links) => {
  return `
    <h1>Hlasování</h1>
    <div class="poll-links">
      ${links.map(
    (link) => (
      `<a class="poll-link" href="poll?id=${link.id}">${link.question}</a>`
    )).join('')
    }
    </div>
  `;
};

fetch('api/polls')
  .then((response) => response.json())
  .then((data) => {
    document.querySelector('.container').innerHTML = PollLinks(data.results);
  });

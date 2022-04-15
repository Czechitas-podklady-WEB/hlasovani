const renderPolls = (polls) => {
  let innerHTML = '';
  polls.forEach((poll) => {
    innerHTML += `
      <div class="poll">${poll.question}</div>
    `;
  })

  document.querySelector('.polls').innerHTML = innerHTML;
};

fetch('/api/polls')
  .then((response) => response.json())
  .then((data) => renderPolls(data.results));
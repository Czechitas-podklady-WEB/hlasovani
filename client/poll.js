const Option = (option, maxVotes) => {
  const ratio = option.voters.length / maxVotes;

  const barWidth = Number.isNaN(ratio) ? '0.5rem' : `${ratio * 100}%`;

  return `
    <div class="option">
      <div class="option__text">${option.text}</div>  
      <div class="option__bar" style="width: ${barWidth};"></div>
      <div class="option__voters">
        ${option.voters.map((voter) => `<span class="voter">${voter}</span>`).join('')}
      </div>
    </div>
  `;
};

const Poll = (poll) => {
  const maxVotes = Math.max(...poll.options.map((option) => option.voters.length));

  return `
    <h1>${poll.question}</h1>
    <div class="options">
      ${poll.options.map((option) => Option(option, maxVotes)).join('')}
    </div>
  `;
};

const params = new URLSearchParams(window.location.search);
fetch(`/api/poll/${params.get('id')}`)
  .then((response) => response.json())
  .then((data) => {
    document.querySelector('.container').innerHTML = Poll(data.poll);
  });
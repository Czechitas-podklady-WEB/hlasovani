const Option = (option) => {
  return `<div class="option">${option.text}</div>`;
};

const Poll = (poll) => {
  return `
    <h1>${poll.question}</h1>
    <div class="options">
      ${poll.options.map((option) => Option(option)).join('')}
    </div>
  `;
};

const params = new URLSearchParams(window.location.search);
fetch(`/api/poll/${params.get('id')}`)
  .then((response) => response.json())
  .then((data) => {
    document.querySelector('.container').innerHTML = Poll(data.poll);
  });
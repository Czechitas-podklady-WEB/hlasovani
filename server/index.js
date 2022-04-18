import express from 'express';
import data from './data.js';
import longpoll from 'express-longpoll';

const port = process.env.PORT ?? 4000;
const baseUrl = process.env.BASE_URL ?? '';

const server = express();
server.use(express.json());

server.use(`${baseUrl}/`, express.static('client', { extensions: ['html'] }));

server.use(`${baseUrl}/docs`, express.static('docs/_site', {
  extensions: ['html'],
}));

server.get(`${baseUrl}/api/polls`, (req, res) => {
  const results = data.map((poll) => ({
    id: poll.id,
    question: poll.question,
    options: poll.options.length,
    voters: poll.options.reduce((sum, option) => sum + option.voters.length, 0),
  }));
  res.json({ results, status: 'success' });
});

server.get(`${baseUrl}/api/clearvotes`, (req, res) => {
  data.forEach(
    (poll) => poll.options.forEach(
      (option) => option.voters = []
    )
  );

  res.json({ status: 'success' });
});

server.get(`${baseUrl}/api/poll/:id`, (req, res) => {
  const id = Number(req.params.id);
  const poll = data.find((p) => p.id === id);
  if (poll === undefined) {
    res.status(404).send({
      status: 'error',
      code: 'not-found',
      message: 'Resource does not exist',
    });
    return;
  }

  res.json({ poll, status: 'success' });
});

const pollUpdates = longpoll(server);
pollUpdates.create(`${baseUrl}/api/poll/:id/updates`, (req, res, next) => {
  req.id = req.params.id;
  next();
});

server.post(`${baseUrl}/api/poll/:id`, (req, res) => {
  const id = Number(req.params.id);
  const poll = data.find((p) => p.id === id);
  if (poll === undefined) {
    res.status(404).send({
      status: 'error',
      code: 'not-found',
      message: 'Resource does not exist',
    });
    return;
  }

  const { optionId, voterName } = req.body;
  if (typeof optionId !== 'number') {
    res.status(400).send({
      status: 'error',
      code: 'imvalid-field',
      message: "The field 'optionId' is missing or is of invalid type",
    });
    return;
  }

  if (typeof voterName !== 'string') {
    res.status(400).send({
      status: 'error',
      code: 'imvalid-field',
      message: "The field 'voterId' is missing or is of invalid type",
    });
    return;
  }

  if (voterName.length === 0 || voterName.length > 12) {
    res.status(400).send({
      status: 'error',
      code: 'imvalid-field',
      message: "Field voterName must not be empty and must not exceed length 12.",
    });
    return;
  }

  const option = poll.options[optionId];
  if (option === undefined) {
    res.status(400).send({
      status: 'error',
      code: 'option-not-found',
      message: `Option with id '${optionId}' does not exist`,
    });
    return;
  }

  if (option.voters.includes(voterName)) {
    res.status(400).send({
      status: 'error',
      code: 'multiple-votes',
      message: `Voter '${voterName}' has already voted for this option`,
    });
    return;
  }

  option.voters.push(voterName);
  pollUpdates.publishToId(`${baseUrl}/api/poll/:id/updates`, id, { poll });
  res.json({ poll, status: 'success' });
});

server.get(`${baseUrl}/api/poll/:id/clearvotes`, (req, res) => {
  const id = Number(req.params.id);
  const poll = data.find((p) => p.id === id);
  if (poll === undefined) {
    res.status(404).send({ status: 'error', code: 'not-found' });
    return;
  }

  poll.options.forEach((option) => option.voters = []);

  res.json({ status: 'success' });
});


server.listen(port, () => {
  console.info(`listening at ${port}...`);
});

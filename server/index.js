import express from 'express';
import cors from 'cors';
import data from './data.js';
import longpoll from 'express-longpoll';

const port = process.env.PORT ?? 4000;
const baseUrl = process.env.BASE_URL ?? '';

const server = express();
server.use(express.json());
server.use(cors());

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
  const authName = req.headers.authorization;
  
  if (authName === undefined || authName === '') {
    res.status(401).send({
      status: 'error',
      code: 'unauthorized',
      message: 'Missing or empty authorization header',
    });
    return;
  }

  if (authName.length < 3 || authName.length > 12) {
    res.status(400).send({
      status: 'error',
      code: 'invalid-authorization',
      message: "The 'authorization' header is too short or too long",
    });
    return;
  }
  
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

  const { optionId } = req.body;
  if (typeof optionId !== 'number') {
    res.status(400).send({
      status: 'error',
      code: 'invalid-field',
      message: "The field 'optionId' is missing or is of invalid type",
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

  option.voters.push(authName);
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

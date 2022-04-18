import express from 'express';
import data from './data.js';

const port = process.env.PORT ?? 4000;
const baseUrl = process.env.BASE_URL ?? '';

const server = express();

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
    res.status(404).send({ status: 'error', code: 'not-found' });
    return;
  }

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

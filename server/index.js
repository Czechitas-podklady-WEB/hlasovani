import express from 'express';

const port = process.env.PORT ?? 4000;
const baseUrl = process.env.BASE_URL ?? '';

const server = express();

server.use(`${baseUrl}/`, express.static('client', { extensions: ['html'] }));

server.use(`${baseUrl}/docs`, express.static('docs/_site', {
  extensions: ['html'],
}));

server.get(`${baseUrl}/api`, (req, res) => {
  res.json({ hello: 'world' });
});

server.listen(port, () => {
  console.info(`listening at ${port}...`);
});

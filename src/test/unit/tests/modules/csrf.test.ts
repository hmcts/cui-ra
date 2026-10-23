import { CSRFToken } from '../../../../main/modules/csrf';
import express from 'express';
import session from 'express-session';
import supertest from 'supertest';

describe('CSRFToken', () => {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(session({ secret: 'csrf-test-secret', resave: false, saveUninitialized: false }));
  new CSRFToken().enableFor(app);
  app.get('/review', (_req, res) => res.send(res.locals.csrfToken));
  app.post('/review', (_req, res) => res.sendStatus(200));
  app.use(
    (err: Error & { status?: number }, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      res.sendStatus(err.status ?? 500);
    }
  );

  test('accepts the token submitted in a form', async () => {
    const agent = supertest.agent(app);
    const token = (await agent.get('/review').expect(200)).text;

    await agent.post('/review').type('form').send({ _csrf: token }).expect(200);
  });

  test('rejects an invalid form token', async () => {
    const agent = supertest.agent(app);
    await agent.get('/review').expect(200);

    await agent.post('/review').type('form').send({ _csrf: 'invalid' }).expect(403);
  });
});

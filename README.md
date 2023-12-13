# cui-ra

Resasonable Adjustments Microsite for Citizen UI Flags

## Getting Started

### Prerequisites

Running the application requires the following tools to be installed in your environment:

- [Node.js](https://nodejs.org/) v12.0.0 or later
- [yarn](https://yarnpkg.com/)
- [Docker](https://www.docker.com)

### Running the application

Install dependencies by executing the following command:

```bash
yarn install
```

Bundle:

```bash
yarn webpack
```

Mount Secrets using pvmount:{env} (demo,aat,perftest,ithc). This command will download azure secrets into a secret folder that will be consumed by properties-volume lib:

```bash
yarn pvmount:aat
```

The application requires a redis cache. This can be created via the following command. (change the password to be the value of redis password stored in the secret folder. or keep it as password and delete the redis password file from the secret folder). alternativly running docker-compose will also create a redis cache ready to be used.

```bash
docker run --name redis -p 6379:6379 -d redis redis-server --requirepass "password"
```

Run:

```bash
yarn start:dev
```

The applications's home page will be available at https://localhost:3100

### Running with Docker-compose

Mount Secrets using pvmount:{env} (demo,aat,perftest,ithc). This command will download azure secrets into a secret folder that will be consumed by properties-volume lib. This folder will be mounted as a volume in the application docker container

```bash
yarn pvmount:aat
```

due to cookie contraints we need to run the application via a nginx proxy on https. the compose file will do this for you. However we need to generate the ssl files that will be mounted. Run the following command

```bash
./bin/generate-ssl-options.sh
```

Create & run docker image:

```bash
docker-compose up --build -d
```

This will start the frontend container a redis cache and a nginx proxy.

NOTE: the frontend application can only be accessed via the nginx proxy because of express-session and cookie contraints

In order to test if the application is up, you can visit https://localhost/demo in your browser. MAKE SURE TO USE HTTPS://

## Developing

### Code style

We use [ESLint](https://github.com/typescript-eslint/typescript-eslint)
alongside [sass-lint](https://github.com/sasstools/sass-lint)

Running the linting with auto fix:

```bash
yarn lint --fix
```

### Running the tests

This template app uses [Jest](https://jestjs.io//) as the test engine. You can run unit tests by executing
the following command:

```bash
yarn test
```

Here's how to run functional tests (the template contains just one sample test):

```bash
yarn test:routes
```

Running accessibility tests:

```bash
yarn test:a11y
```

Make sure all the paths in your application are covered by accessibility tests (see [a11y.ts](src/test/a11y/a11y.ts)).

### Security

#### CSRF prevention

[Cross-Site Request Forgery](https://github.com/pillarjs/understanding-csrf) prevention has already been
set up in this template, at the application level. However, you need to make sure that CSRF token
is present in every HTML form that requires it. For that purpose you can use the `csrfProtection` macro,
included in this template app. Your njk file would look like this:

```
{% from "macros/csrf.njk" import csrfProtection %}
...
<form ...>
  ...
    {{ csrfProtection(csrfToken) }}
  ...
</form>
...
```

#### Helmet

This application uses [Helmet](https://helmetjs.github.io/), which adds various security-related HTTP headers
to the responses. Apart from default Helmet functions, following headers are set:

- [Referrer-Policy](https://helmetjs.github.io/docs/referrer-policy/)
- [Content-Security-Policy](https://helmetjs.github.io/docs/csp/)

There is a configuration section related with those headers, where you can specify:

- `referrerPolicy` - value of the `Referrer-Policy` header

Here's an example setup:

```json
    "security": {
      "referrerPolicy": "origin",
    }
```

Make sure you have those values set correctly for your application.

### Healthcheck

The application exposes a health endpoint (https://localhost:3100/health), created with the use of
[Nodejs Healthcheck](https://github.com/hmcts/nodejs-healthcheck) library. This endpoint is defined
in [health.ts](src/main/routes/health.ts) file. Make sure you adjust it correctly in your application.
In particular, remember to replace the sample check with checks specific to your frontend app,
e.g. the ones verifying the state of each service it depends on.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

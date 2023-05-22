# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:18-alpine as base

USER root
RUN corepack enable
USER hmcts

COPY --chown=hmcts:hmcts .yarn ./.yarn
COPY --chown=hmcts:hmcts config ./config
COPY --chown=hmcts:hmcts package.json yarn.lock .yarnrc.yml tsconfig.json ./

RUN yarn workspaces focus --all --production && yarn cache clean

# ---- Build image ----
FROM base as build
COPY --chown=hmcts:hmcts . ./
RUN PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true yarn install --immutable
COPY tsconfig.json ./
COPY --chown=hmcts:hmcts src/main ./src/main

RUN yarn build:prod

# ---- Runtime image ----
FROM base as runtime
COPY --from=build $WORKDIR/src/main ./src/main
COPY --from=build $WORKDIR/tsconfig.json ./
COPY config ./config

RUN PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true yarn install --immutable

# TODO: expose the right port for your application
EXPOSE 3100

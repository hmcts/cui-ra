# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:20-alpine as base

USER root
RUN corepack enable
USER hmcts

COPY --chown=hmcts:hmcts . .

# ---- Build image ----
FROM base as build

RUN yarn install --immutable && \
    yarn build:prod && \
    rm -rf webpack/ webpack.config.js

# ---- Runtime image ----
FROM base as runtime

COPY --from=build $WORKDIR/src/main ./src/main
COPY --from=build $WORKDIR/.yarn .yarn/
COPY --from=build $WORKDIR/.pnp.cjs $WORKDIR/.pnp.loader.mjs ./

# TODO: expose the right port for your application
EXPOSE 3100

HEALTHCHECK --interval=30s --timeout=15s --start-period=60s --retries=3 \
    CMD wget -q --spider localhost:3100/health || exit 1

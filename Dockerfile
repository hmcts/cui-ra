# ---- Base image ----
FROM hmctspublic.azurecr.io/base/node:20-alpine AS base

USER root
RUN corepack enable
USER hmcts

COPY --chown=hmcts:hmcts . .

# ---- Build image ----
FROM base AS build

RUN yarn install --immutable && \
    yarn build:prod && \
    rm -rf webpack/ webpack.config.js && \
    yarn build:server

# ---- Runtime image ----
FROM base AS runtime

COPY --from=build $WORKDIR/dist ./dist
COPY --from=build $WORKDIR/src/main/assets/scss ./dist/assets/scss
COPY --from=build $WORKDIR/src/main/views ./dist/views
COPY --from=build $WORKDIR/src/main/public ./dist/public
COPY --from=build $WORKDIR/src/main/resources/configs ./dist/resources/configs
COPY --from=build $WORKDIR/src/main/resources/translation ./dist/resources/translation
COPY --from=build $WORKDIR/src/main/demo/data ./dist/demo/data
COPY --from=build $WORKDIR/.yarn .yarn/
COPY --from=build $WORKDIR/.pnp.cjs .pnp.cjs
COPY --from=build $WORKDIR/.pnp.loader.mjs .pnp.loader.mjs

# TODO: expose the right port for your application
EXPOSE 3100

HEALTHCHECK --interval=30s --timeout=15s --start-period=60s --retries=3 \
    CMD wget -q --spider localhost:3100/health || exit 1

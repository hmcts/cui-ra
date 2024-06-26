#!/bin/bash
set -ex

export E2E_FRONTEND_URL=${TEST_URL}
export E2E_OUTPUT_DIR='./functional-output/crossbrowser'

if [[ "$BROWSER_GROUP" == "" ]]
then
    EXIT_STATUS=0
    BROWSER_GROUP=chrome yarn test-crossbrowser-e2e || EXIT_STATUS=$?
    BROWSER_GROUP=firefox yarn test-crossbrowser-e2e || EXIT_STATUS=$?
    BROWSER_GROUP=safari yarn test-crossbrowser-e2e || EXIT_STATUS=$?
    BROWSER_GROUP=microsoft yarn test-crossbrowser-e2e || EXIT_STATUS=$?
    echo EXIT_STATUS: $EXIT_STATUS
else
    # Compatible with Jenkins parallel crossbrowser pipeline
    yarn test-crossbrowser-e2e || EXIT_STATUS=$?
    echo EXIT_STATUS: $EXIT_STATUS
fi
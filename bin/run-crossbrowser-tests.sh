#!/bin/bash
set -ex

export E2E_FRONTEND_URL=${TEST_URL}
export E2E_OUTPUT_DIR='./functional-output/crossbrowser'
EXIT_STATUS=0

if [[ "$BROWSER_GROUP" == "" ]]
then
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

exit "$EXIT_STATUS"

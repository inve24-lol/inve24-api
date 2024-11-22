#!/bin/sh

if [ "$MIGRATION_MODE" = "run" ]; then
  echo ">>> Running migrations..."
  npx ts-node ./node_modules/typeorm/cli.js -d ./typeorm.config.ts migration:run

elif [ "$MIGRATION_MODE" = "revert" ]; then
  echo ">>> Reverting migrations..."
  npx ts-node ./node_modules/typeorm/cli.js -d ./typeorm.config.ts migration:revert

else
  echo ">>> No valid argument provided."
  echo ">>> Please set the 'MIGRATION_MODE' value to either 'run' or 'revert' in the dotenv file."
  echo ">>> Exiting..."
  exit 1
fi

node dist/main
#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

trap killgroup SIGINT

killgroup(){
  echo killing...
  kill $CLIENTA_PID
  kill $CLIENTB_PID
  kill $CLIENTC_PID
}

bun $SCRIPT_DIR/data.ts &
CLIENTA_PID=$!
bun $SCRIPT_DIR/data.ts &
CLIENTB_PID=$!
bun $SCRIPT_DIR/data.ts &
CLIENTC_PID=$!
wait



#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

trap killgroup SIGINT

killgroup(){
  echo killing...
  kill $MODEL_PID
  kill $MODELA_PID
  kill $MODELB_PID
}

bun $SCRIPT_DIR/model.ts &
MODEL_PID=$!
bun $SCRIPT_DIR/model_a.ts &
MODELA_PID=$!
bun $SCRIPT_DIR/model_b.ts &
MODELB_PID=$!
wait

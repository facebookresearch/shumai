#!/bin/bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

trap killgroup SIGINT

killgroup(){
  echo killing...
  kill $MODEL_PID
  kill $MODELA_PID
  kill $MODELB_PID
}

bun $SCRIPT_DIR/model.ts a &
MODEL_PID=$!
bun $SCRIPT_DIR/model_a.ts a &
MODELA_PID=$!
bun $SCRIPT_DIR/model_b.ts a &
MODELB_PID=$!
wait


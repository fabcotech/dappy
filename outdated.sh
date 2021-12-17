#!/bin/bash

DEPENDENCIES=$1
FAIL=false

for DEP in $(echo $DEPENDENCIES | sed "s/,/ /g")
do
    TO_BE_PARSED=$(npm outdated -p $DEP)
    ACTUAL=$(echo "$TO_BE_PARSED" | cut -d: -f3)
    ACTUAL_VERSION=$(echo "$ACTUAL" | cut -d@ -f2)
    LATEST=$(echo "$TO_BE_PARSED" | cut -d: -f4)
    LATEST_VERSION=$(echo "$LATEST" | cut -d@ -f2)
    if [ "$ACTUAL" != "$LATEST" ]; then
      echo "SECURITY ISSUE $DEP: actual $ACTUAL_VERSION, latest $LATEST_VERSION, run npm i $DEP@latest to fix it"
      FAIL=true
    fi
done

if [[ "$FAIL" == true ]]; then
  exit 1
fi
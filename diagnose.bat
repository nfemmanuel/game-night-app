@echo off
echo Starting diagnosis > diagnosis.log
git status >> diagnosis.log 2>&1
echo. >> diagnosis.log
echo DIFF: >> diagnosis.log
git diff >> diagnosis.log 2>&1
echo. >> diagnosis.log
echo STAGED DIFF: >> diagnosis.log
git diff --staged >> diagnosis.log 2>&1
echo Done >> diagnosis.log

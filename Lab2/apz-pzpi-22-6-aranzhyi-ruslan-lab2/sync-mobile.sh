#!/bin/bash

if [ ! -d _git.bak ]; then
  git init
  git remote add origin "https://github.com/ArRuslan/apz-mobile"
else
  mv _git.bak .git
fi

git pull origin master
mv .git _git.bak

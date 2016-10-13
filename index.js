#!/usr/bin/env node
'use strict';

const program   = require('commander');
const request   = require('request');
const fs        = require('fs');

program.parse(process.argv); // notice that we have to parse in a new statement.

if (program.args.length === 0) {
  program.help();
  process.exit();
}

function sift() {
  if (program.args[0] == null) {
    return;
  }
  let repoInput = program.args[0];
  let inputSplit = repoInput.split('\-');
  let author = inputSplit[0].split("");
  let privatePackage = false;
  if (author[0] === '@') {
    author.splice(0,1);
    author = author.join('');
    privatePackage = true;
  }

  let recipeRepo = [];
  for (let i=privatePackage ? 1 : 0; i<inputSplit.length; i++) {
    recipeRepo.push(inputSplit[i]);
  }
  recipeRepo = recipeRepo.join('-');
  return {
    private: privatePackage,
    author: privatePackage ? author : 'null',
    name: recipeRepo
  }
}

// https://raw.githubusercontent.com/MarellaB/tbd-gulp/master/gulpfile.js
function getRepo() {
  let recipeInfo = sift();
  request('https://raw.githubusercontent.com/' + recipeInfo.author + '/' +  + '/master/gulpfile.js').pipe(fs.createWriteStream('doodle.png'))
  
}
var recipeRepo = getRepo();
fs.writeFile("gulpfile.js", recipeRepo.gulpfile, function(err) {
  if (err) {
    return console.log('err');
  }
  console.log(recipeRepo.gulpfile);
  console.log('Gulpfile created');
});

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

function sift(siftLine) {
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

function pullFile() {
  let recipeInfo = sift(program);
  if (recipeInfo.author == null) {
    console.log('Public packages are not yet implemented. Please specify an author.');
  }
  request('https://raw.githubusercontent.com/' + recipeInfo.author + '/' + recipeInfo.name + '/master/gulpfile.js',
    (error, response, body) => {
      if (response.statusCode == 404) {
        console.log('Package not found');
        console.log('Please check the recipe and author entered and make sure everything is spelled correctly');
        process.exit();
      }
    }).pipe(fs.createWriteStream('gulpfile.js'));
}
pullFile();

var npm = require("npm");
npm.load(myConfigObject, function (er) {
  if (er) return handlError(er)
  npm.commands.install(["some", "args"], function (er, data) {
    if (er) return commandFailed(er)
    // command succeeded, and data might have some info
  })
  npm.registry.log.on("log", function (message) { "working" })
})

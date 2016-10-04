#!/usr/bin/env node
'use strict';

const program = require('commander');
const request = require('request');

program.parse(process.argv); // notice that we have to parse in a new statement.

function sift() {
  let repoInput = program.args[0];
  let inputSplit = repoInput.split('\-');
  let author = inputSplit[0].split("");
  let privatePackage = false;
  if (author[0] === '@') {
    author.splice(0,1);
    author = author.join('');
    privatePackage = true;
  }

  var recipeRepo = [];
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

function getRepo() {
  var recipeInfo = sift();
  if (recipeInfo.private) {
    console.log('Pulling private recipe ' + recipeInfo.name + ' by ' + recipeInfo.author);
  }
  return {
    gulpfile: request({
      uri: 'https://raw.githubusercontent.com/' + recipeInfo.author + '/'
        + recipeInfo.name + '/master/gulpfile.js'
      }, function(error, response, body) {
        return body;
      }),
    config: request({
      uri: 'https://raw.githubusercontent.com/' + recipeInfo.author + '/'
        + recipeInfo.name + '/master/.tbdconfig'
      }, function(error, response, body) {
        return body;
      })
  };
}
var recipeRepo = getRepo();

if (program.args.length === 0) program.help();

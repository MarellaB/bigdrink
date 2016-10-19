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

function pullRecipe(recipeInfo) {
  console.log('Pulling Files');
  if (recipeInfo.author == null) {
    console.log('Public packages are not yet implemented. Please specify an author.');
  }
  // Pull the config and gulpfile from github (This is why they must be public for now)
  request('https://raw.githubusercontent.com/' + recipeInfo.author + '/' + recipeInfo.name + '/master/config.json',
    (error, response, body) => {
      if (response.statusCode == 404) {
        console.log('Config not found');
        console.log('Please check the recipe and author entered and make sure everything is spelled correctly');
        process.exit();
      }

      request('https://raw.githubusercontent.com/' + recipeInfo.author + '/' + recipeInfo.name + '/master/gulpfile.js',
        (error, response, body) => {
          if (response.statusCode == 404) {
            console.log('Gulpfile not found');
            console.log('Please check the recipe and author entered and make sure everything is spelled correctly');
            process.exit();
          }
          readConfig();
        }).pipe(fs.createWriteStream('gulpfile.js'));
    }).pipe(fs.createWriteStream('gulpconf.json'));
}

function readConfig() {
  console.log('Installing dependencies');
  let exec = require('child_process').exec;
  let req = fs.createReadStream('gulpconf.json');
  let installCounter = 0;
  let config;
  req.setEncoding('utf8');
  req.on('data', (chunk) => {
    config = JSON.parse(chunk);
    for (var i in config.requirements) {
      exec('npm install ' + config.requirements[i], function(err, stdout, stderr) {
        console.log(stdout);
        installCounter += 1;
        if (installCounter == config.requirements.length) {
          console.log('Commands:');
          for (var i in config.commands) {
            console.log('|-- ' + i + ': "' + config.commands[i] + '"');
          }
        }
      });
    }
  });
}

pullRecipe(sift());

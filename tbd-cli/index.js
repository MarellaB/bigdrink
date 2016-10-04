#!/usr/bin/env node
'use strict';

const program = require('commander');


program
  .version('0.0.1')
  .command('command <req> [optional]')
  .description('command description')
  .option('-o, --option','we can still have add options')
  .action(function(req,optional){
    console.log('.action() allows us to implement the command');
    console.log('User passed %s', req);
    if (optional) {
      optional.forEach(function(opt){
        console.log("User passed optional arguments: %s", opt);
      });
    }
  });
program.parse(process.argv); // notice that we have to parse in a new statement.
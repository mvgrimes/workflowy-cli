#!./node_modules/.bin/babel-node

const program = require('commander');
const update = require('./lib/update');
const add = require('./lib/add');
const list = require('./lib/list');

program.version('0.1.0', '-V, --version').option('-v, --verbose', 'Verbose');

program
  .command('update')
  .description('update t:yyyy-mm-dd style tags to #today')
  .action(update);

program
  .command('add <text...>')
  .description('create a new entry')
  .option('-p, --parentid <id>', '<36-digit uuid of parent> (required)')
  .option('-P, --priority [#]', '0 as first child, 1 as second', 9999)
  .option('-n, --note [str]', 'a note for the node', '')
  .action(add);

program
  .command('list')
  .description('list stuff')
  .option('-i, --ids', 'print ids')
  .option('-m, --match <regex>', 'find nodes matching regex')
  .description('list')
  .action(list);

program.parse(process.argv);

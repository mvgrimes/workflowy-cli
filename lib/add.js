const auth = require('./auth');

module.exports = async (textArray, cmd) => {
  console.log('add');

  const priority = cmd.priority;
  const description = cmd.note;
  const parentid = cmd.parentid;
  const name = textArray.join(' ');

  if (!parentid) cmd.help();

  console.log(`adding ${name} under ${parentid}`);
  const wf = await auth();

  wf.addChildren([{ name, description }], { id: parentid }, priority)
    .then(result => {
      console.log('result:', result);
      console.log('created!');
    })
    .catch(error => console.error(error))
    .finally(process.exit);
};

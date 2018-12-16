const auth = require('./auth');

module.exports = async cmd => {
  console.log('list');
  console.log(cmd.match);

  const wf = await auth();

  if (cmd.ids || cmd.match) {
    const nodes = await wf.find(cmd.match);
    nodes.forEach(node => console.log(`${node.nm} [${node.id}]`));
  } else {
    const text = await wf.asText();
    console.log(text);
  }
};

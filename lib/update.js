const Q = require('q');
const auth = require('./auth');

module.exports = async () => {
  console.log('update');
  const wf = await auth();

  const nodes = await wf
    .find(/t:\d+-\d+-\d+/, false, false)
    .then(foundNodes => {
      return foundNodes.filter(node => {
        if (node.nm.match(/#today/)) return false;

        const matches = node.nm.match(/t:(\d+-\d+-\d+)/);
        let mt;
        try {
          mt = Date.parse(matches[1]);
        } catch (error) {
          return false;
        }

        return mt < Date.now();
      });
    })
    .catch(error => console.error(error));

  return Q.allSettled(
    nodes.map(node => {
      // console.log(`${node.nm} #today`);
      return wf
        .update(node, `${node.nm} #today`)
        .catch(error => console.error(error));
    }),
  )
    .catch(error => console.error(error))
    .finally(process.exit);
};

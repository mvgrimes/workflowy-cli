const Workflowy = require('workflowy');
const prompt = require('prompt');
const fs = require('fs');
const Q = require('q');

const userHome =
  process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
const rcPath = `${userHome}/.wfrc`;

const exists = fs.existsSync(rcPath);
const rc = exists && fs.readFileSync(rcPath, 'utf8');
const sessionIdRE = /sessionid: (\w+)/;

function auth() {
  console.log(
    'What is your workflowy login info? This will not be saved, merely used once to authenticate.',
  );
  const schema = {
    properties: {
      email: {
        required: true,
      },
      password: {
        required: true,
        hidden: true,
      },
    },
  };
  const deferred = Q.defer();
  prompt.start();
  prompt.get(schema, (err, result) => {
    if (err) {
      console.log('CANCELLED');
      return Q(false);
    }

    const wf = new Workflowy({
      username: result.email,
      password: result.password,
    });

    return wf.login
      .then(() => {
        if (wf.sessionid) {
          console.log('Login successful.');

          try {
            fs.writeFileSync(rcPath, `sessionid: ${wf.sessionid}\n`);
            console.log('Successfully wrote sessionid to ~/.wfrc');
            deferred.resolve('Successfully wrote sessionid to ~/.wfrc');
          } catch (e) {
            console.log('Failed to write sessionid to ~/.wfrc');
            deferred.reject(new Error('Failed to write sessionid to ~/.wfrc'));
          }
        } else {
          console.log('Failed to get sessionid. Check your username/password.');
          deferred.reject(new Error('Failed to get sessionid'));
        }
        return true;
      })
      .catch(error => {
        console.error(error);
      });
    // .finally(process.exit());
  });

  return deferred.promise;
}

module.exports = () => {
  if (rc && sessionIdRE.test(rc)) {
    const sessionid = rc.match(sessionIdRE)[1];
    console.log(`got session id: ${sessionid}`);
    return Q.fcall(() => new Workflowy({ sessionid }));
  }

  return auth();
};

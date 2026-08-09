
import dns from 'node:dns';

dns.setServers([
  '8.8.8.8',
  '1.1.1.1'
]);

dns.promises
  .resolveSrv('_mongodb._tcp.usmanstore.om6bv9a.mongodb.net')
  .then((result) => {
    console.log('SRV RESULT:', result);
  })
  .catch((error) => {
    console.error('DNS ERROR:', error);
  });
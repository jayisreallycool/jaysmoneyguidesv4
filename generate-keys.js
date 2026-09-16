const crypto = require('crypto');

// Generate secure random keys
const adminAccessKey = crypto
  .randomBytes(32)
  .toString('hex')
  .slice(0, 40);

const nextPublicAdminAccessKey = crypto
  .randomBytes(24)
  .toString('hex')
  .slice(0, 32);

console.log('\n✅ NEW ADMIN KEYS GENERATED\n');
console.log('ADMIN_ACCESS_KEY=' + adminAccessKey);
console.log('NEXT_PUBLIC_ADMIN_ACCESS_KEY=' + nextPublicAdminAccessKey);
console.log('\n⚠️  Copy these to your .env.local file immediately.\n');

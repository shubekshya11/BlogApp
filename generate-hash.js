const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'Admin@123456';
  const hash = await bcrypt.hash(password, 10);
  console.log('Password:', password);
  console.log('Bcrypt Hash:', hash);
  
  // Also show the SQL command to use:
  console.log('\nSQL command to use:');
  console.log(`UPDATE users SET password_hash = '${hash}' WHERE email = 'admin@blog.com';`);
}

generateHash();
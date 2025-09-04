// Quick test script for Wine With Pete app
// Run with: node test-app.js

const testEndpoints = [
  '/',
  '/about',
  '/events',
  '/store',
  '/join',
  '/support',
  '/archive',
  '/wine-with',
  '/admin',
  '/sitemap.xml',
  '/robots.txt'
];

const baseUrl = 'http://localhost:3000';

async function testEndpoint(endpoint) {
  try {
    const response = await fetch(`${baseUrl}${endpoint}`);
    const status = response.status;
    const isOk = status >= 200 && status < 300;
    
    console.log(`${isOk ? '✅' : '❌'} ${endpoint} - ${status}`);
    
    if (!isOk) {
      console.log(`   Error: ${response.statusText}`);
    }
  } catch (error) {
    console.log(`❌ ${endpoint} - Connection failed`);
    console.log(`   Error: ${error.message}`);
  }
}

async function runTests() {
  console.log('🧪 Testing Wine With Pete App...\n');
  
  for (const endpoint of testEndpoints) {
    await testEndpoint(endpoint);
  }
  
  console.log('\n✨ Testing complete!');
  console.log('\nNext steps:');
  console.log('1. Test Stripe integration with test cards');
  console.log('2. Verify all forms work');
  console.log('3. Check mobile responsiveness');
  console.log('4. Deploy to production');
}

runTests();

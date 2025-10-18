#!/usr/bin/env node

/**
 * ICE FLEET - Automated Deployment Verification Script
 *
 * This script verifies your Render deployment is working correctly.
 * Run: node verify-deployment.js <your-render-url>
 *
 * Example: node verify-deployment.js https://icefleet-app.onrender.com
 */

const https = require('https');
const http = require('http');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// Get URL from command line
const baseUrl = process.argv[2];

if (!baseUrl) {
  console.error(`${colors.red}❌ Error: Please provide your Render URL${colors.reset}`);
  console.log(`${colors.cyan}Usage: node verify-deployment.js <render-url>${colors.reset}`);
  console.log(`${colors.cyan}Example: node verify-deployment.js https://icefleet-app.onrender.com${colors.reset}`);
  process.exit(1);
}

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

console.log(`\n${'='.repeat(60)}`);
console.log(`${colors.blue}🚀 ICE FLEET DEPLOYMENT VERIFICATION${colors.reset}`);
console.log(`${'='.repeat(60)}\n`);
console.log(`${colors.cyan}Testing: ${baseUrl}${colors.reset}\n`);

// Helper function to make HTTP requests
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;

    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      timeout: 30000,
      headers: {
        'User-Agent': 'ICE-FLEET-Deployment-Verifier/1.0'
      }
    };

    protocol.get(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ statusCode: res.statusCode, data: jsonData, headers: res.headers });
        } catch (e) {
          resolve({ statusCode: res.statusCode, data: data, headers: res.headers });
        }
      });
    }).on('error', (err) => {
      reject(err);
    }).on('timeout', () => {
      reject(new Error('Request timeout'));
    });
  });
}

// Test function
async function runTest(name, endpoint, validator) {
  const startTime = Date.now();
  process.stdout.write(`${colors.yellow}⏳ ${name}...${colors.reset}`);

  try {
    const url = `${baseUrl}${endpoint}`;
    const response = await makeRequest(url);
    const duration = Date.now() - startTime;

    const result = validator(response);

    if (result.success) {
      console.log(`\r${colors.green}✓ ${name} (${duration}ms)${colors.reset}`);
      if (result.message) {
        console.log(`  ${colors.cyan}→ ${result.message}${colors.reset}`);
      }
      results.passed++;
      results.tests.push({ name, status: 'passed', duration, details: result.message });
    } else {
      console.log(`\r${colors.red}✗ ${name} (${duration}ms)${colors.reset}`);
      console.log(`  ${colors.red}→ ${result.message}${colors.reset}`);
      results.failed++;
      results.tests.push({ name, status: 'failed', duration, details: result.message });
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    console.log(`\r${colors.red}✗ ${name} (${duration}ms)${colors.reset}`);
    console.log(`  ${colors.red}→ Error: ${error.message}${colors.reset}`);
    results.failed++;
    results.tests.push({ name, status: 'failed', duration, details: error.message });
  }
}

// Test validators
const tests = [
  {
    name: 'Health Check Endpoint',
    endpoint: '/api/health',
    validator: (res) => {
      if (res.statusCode !== 200) {
        return { success: false, message: `Expected 200, got ${res.statusCode}` };
      }
      if (!res.data.status) {
        return { success: false, message: 'Missing status field' };
      }
      if (res.data.status !== 'healthy') {
        return { success: false, message: `Status is ${res.data.status}, expected healthy` };
      }
      if (res.data.database === 'connected') {
        return { success: true, message: 'Database connected successfully' };
      } else if (res.data.database === 'disconnected') {
        return { success: false, message: 'Database is disconnected' };
      } else {
        return { success: true, message: 'Health check passed (no database info)' };
      }
    }
  },
  {
    name: 'Dashboard Stats API',
    endpoint: '/api/dashboard/stats',
    validator: (res) => {
      if (res.statusCode !== 200) {
        return { success: false, message: `Expected 200, got ${res.statusCode}` };
      }
      if (res.data.error) {
        return { success: false, message: res.data.error };
      }
      if (res.data.fleet) {
        return { success: true, message: `Fleet data loaded (${res.data.fleet.totalVehicles || 0} vehicles)` };
      }
      return { success: true, message: 'Dashboard stats endpoint responding' };
    }
  },
  {
    name: 'Fleet Vehicles API',
    endpoint: '/api/fleet/vehicles',
    validator: (res) => {
      if (res.statusCode !== 200) {
        return { success: false, message: `Expected 200, got ${res.statusCode}` };
      }
      if (res.data.error) {
        return { success: false, message: res.data.error };
      }
      if (Array.isArray(res.data)) {
        return { success: true, message: `${res.data.length} vehicles found` };
      }
      return { success: true, message: 'Fleet vehicles endpoint responding' };
    }
  },
  {
    name: 'Fleet Trailers API',
    endpoint: '/api/fleet/trailers',
    validator: (res) => {
      if (res.statusCode !== 200) {
        return { success: false, message: `Expected 200, got ${res.statusCode}` };
      }
      if (res.data.error) {
        return { success: false, message: res.data.error };
      }
      if (Array.isArray(res.data)) {
        return { success: true, message: `${res.data.length} trailers found` };
      }
      return { success: true, message: 'Fleet trailers endpoint responding' };
    }
  },
  {
    name: 'Drivers API',
    endpoint: '/api/drivers',
    validator: (res) => {
      if (res.statusCode !== 200) {
        return { success: false, message: `Expected 200, got ${res.statusCode}` };
      }
      if (res.data.error) {
        return { success: false, message: res.data.error };
      }
      if (Array.isArray(res.data)) {
        return { success: true, message: `${res.data.length} drivers found` };
      }
      return { success: true, message: 'Drivers endpoint responding' };
    }
  },
  {
    name: 'Compliance Alerts API',
    endpoint: '/api/compliance/alerts',
    validator: (res) => {
      if (res.statusCode !== 200) {
        return { success: false, message: `Expected 200, got ${res.statusCode}` };
      }
      if (res.data.error) {
        return { success: false, message: res.data.error };
      }
      return { success: true, message: 'Compliance alerts endpoint responding' };
    }
  },
  {
    name: 'Compliance Status API',
    endpoint: '/api/compliance/status',
    validator: (res) => {
      if (res.statusCode !== 200) {
        return { success: false, message: `Expected 200, got ${res.statusCode}` };
      }
      if (res.data.error) {
        return { success: false, message: res.data.error };
      }
      return { success: true, message: 'Compliance status endpoint responding' };
    }
  },
  {
    name: 'Maintenance Records API',
    endpoint: '/api/maintenance/records',
    validator: (res) => {
      if (res.statusCode !== 200) {
        return { success: false, message: `Expected 200, got ${res.statusCode}` };
      }
      if (res.data.error) {
        return { success: false, message: res.data.error };
      }
      return { success: true, message: 'Maintenance records endpoint responding' };
    }
  },
  {
    name: 'HTTPS/SSL Certificate',
    endpoint: '/',
    validator: (res) => {
      const url = new URL(baseUrl);
      if (url.protocol === 'https:') {
        return { success: true, message: 'HTTPS enabled with valid certificate' };
      }
      return { success: false, message: 'HTTPS not enabled' };
    }
  }
];

// Run all tests
async function runAllTests() {
  console.log(`${colors.blue}Running ${tests.length} verification tests...\n${colors.reset}`);

  for (const test of tests) {
    await runTest(test.name, test.endpoint, test.validator);
  }

  // Print summary
  console.log(`\n${'='.repeat(60)}`);
  console.log(`${colors.blue}DEPLOYMENT VERIFICATION SUMMARY${colors.reset}`);
  console.log(`${'='.repeat(60)}\n`);

  console.log(`${colors.green}✓ Passed: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}✗ Failed: ${results.failed}${colors.reset}`);
  console.log(`Total Tests: ${results.passed + results.failed}\n`);

  if (results.failed === 0) {
    console.log(`${colors.green}🎉 ALL TESTS PASSED! Deployment is healthy.${colors.reset}\n`);
    console.log(`${colors.cyan}Your ICE FLEET application is ready for use!${colors.reset}`);
    console.log(`${colors.cyan}Access it at: ${baseUrl}${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`${colors.red}⚠️  Some tests failed. Please review the errors above.${colors.reset}\n`);
    console.log(`${colors.yellow}Troubleshooting tips:${colors.reset}`);
    console.log(`${colors.yellow}1. Check Render logs for errors${colors.reset}`);
    console.log(`${colors.yellow}2. Verify DATABASE_URL is set correctly${colors.reset}`);
    console.log(`${colors.yellow}3. Ensure migrations ran successfully${colors.reset}`);
    console.log(`${colors.yellow}4. Check health endpoint: ${baseUrl}/api/health${colors.reset}\n`);
    process.exit(1);
  }
}

// Start testing
runAllTests().catch((error) => {
  console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  process.exit(1);
});

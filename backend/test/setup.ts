/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-require-imports */
// test/setup.ts - باستخدام require
// eslint-disable-next-line @typescript-eslint/no-unsafe-call
require('dotenv').config({ path: '.env.test' });

// Increase timeout for E2E tests
jest.setTimeout(30000);

// Global setup
beforeAll(() => {
  console.log('🧪 Running tests...');
  console.log(`📦 Database: ${process.env.DB_NAME || 'task_management_test'}`);
});

afterAll(() => {
  console.log('✅ Tests completed');
});

// Mock logger for tests
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
jest.mock('@nestjs/common', () => ({
  ...jest.requireActual('@nestjs/common'),
  Logger: jest.fn().mockImplementation(() => ({
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    verbose: jest.fn(),
  })),
}));

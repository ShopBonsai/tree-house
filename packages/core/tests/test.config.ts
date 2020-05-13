// Overwrite console.logs
console.info = jest.fn(() => { });
console.error = jest.fn(() => { });
console.warn = jest.fn(() => { });

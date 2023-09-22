import multiFetch from '../src/helpers/multiFetch';

const endpoints = [
  'https://jsonplaceholder.typicode.com/posts/1',
  'https://httpbin.org/delay/2',
  'https://jsonplaceholder.typicode.com/posts/2',
  'https://jsonplaceholder.typicode.com/posts/3',
  'https://httpbin.org/delay/1',
  'https://jsonplaceholder.typicode.com/posts/4'
];

const MAX_CONCURRENCY = 2;

describe('multiFetch', () => {
  it(`should fetch URLs and return responses with MAX_CONCURRENCY equal ${MAX_CONCURRENCY}`, async () => {
    const response = await multiFetch(endpoints, MAX_CONCURRENCY);

    for (let i = 0; i < endpoints.length; i = i + MAX_CONCURRENCY) {
      const urls = response.slice(i, i + MAX_CONCURRENCY).map(res => res.url);

      for (let j = i; j < i + MAX_CONCURRENCY; j++) {
        try {
          expect(urls).toContain(endpoints[j]);
        } catch (error) {
          throw new Error(`URL ${endpoints[j]} should be between position ${i} to ${i + MAX_CONCURRENCY}`);
        }
      }
    }
  });

  it(`should fetch URLs when MAX_CONCURRENCY equal ${MAX_CONCURRENCY} is greater than URLs length`, async () => {
    const response = await multiFetch([endpoints[0]], MAX_CONCURRENCY);
    expect(response.length).toEqual(1);
  });

  it('should keep fetching URLs even when one of them failed', async () => {
    const response = await multiFetch(['https://itwillfail.oops', ...endpoints], MAX_CONCURRENCY);
    expect(response.length).toEqual(endpoints.length + 1);
  });
});

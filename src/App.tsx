import { useState } from 'react';
import multiFetch from './helpers/multiFetch';

const endpoints = [
  'https://jsonplaceholder.typicode.com/posts/1',
  'https://httpbin.org/delay/2',
  'https://jsonplaceholder.typicode.com/posts/2',
  'https://jsonplaceholder.typicode.com/posts/3',
  'https://httpbin.org/delay/1',
  'https://jsonplaceholder.typicode.com/posts/4'
];

function App() {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<any>(null);

  const handleExecuteQueries = async () => {
    data && setData(null);
    setLoading(true);

    const res = await multiFetch(endpoints, 2);

    setLoading(false);
    setData(res);
  };

  return (
    <>
      <button onClick={handleExecuteQueries}>Execute queries</button>
      <hr />
      <table>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={2}>Loading...</td>
            </tr>
          ) : data ? (
            data.map((item: any, index: number) => (
              <tr key={index}>
                <th>
                  Endpoint {index + 1}
                  <br />
                  {endpoints[index]}
                </th>
                <td>{JSON.stringify(item)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2}>No data</td>
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

export default App;

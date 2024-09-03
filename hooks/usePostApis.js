import { useState } from 'react';

function usePostApi() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const postApi = async (url, body,
     headers = { 'Content-Type': 'application/json' }) => {
    setLoading(true);
    setError(null);
console.log("data coming from form ",url,body)
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(body),
      });
console.log("response",response)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log("responsedata",responseData)

      setData(responseData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, postApi };
}

export default usePostApi;


// to call
// const { data, loading, error, postApi } = usePostApi();

//   useEffect(() => {
//     const requestBody = {
//       name: 'John Doe',
//       email: 'johndoe@example.com',
//     };

//     postApi('https://example.com/api/v1/submit', requestBody);
//   }, []);
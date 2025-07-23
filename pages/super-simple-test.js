export default function SuperSimpleTest() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Super Simple Test</h1>
      <p>Si vous voyez ceci, React fonctionne.</p>
      <button onClick={() => alert('Click fonctionne!')}>Tester JavaScript</button>
      <hr />
      <button onClick={() => {
        console.log('Fetching...');
        fetch('/api/simple-test')
          .then(res => res.json())
          .then(data => {
            console.log('Data:', data);
            alert('API Response: ' + JSON.stringify(data));
          })
          .catch(err => {
            console.error('Error:', err);
            alert('Error: ' + err.message);
          });
      }}>
        Tester API
      </button>
    </div>
  );
} 
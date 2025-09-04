// Quick test to check if the API is working
// Run this with: node test-api.js

const testAPI = async () => {
  try {
    console.log('Testing events API...');
    
    const response = await fetch('http://localhost:3001/api/events');
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (data.events) {
      console.log(`Found ${data.events.length} events`);
      data.events.forEach(event => {
        console.log(`- ${event.title} on ${event.event_date}`);
      });
    }
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
};

testAPI();

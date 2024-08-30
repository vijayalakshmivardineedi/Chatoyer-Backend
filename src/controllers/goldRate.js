const fetch = require('node-fetch');

exports.getGoldPrice = async () => {
    try {
      const apiKey = 'WJEEVSVAED3ZH16SPATW7796SPATW';
      const url = `https://api.metals.dev/v1/latest?api_key=${apiKey}&currency=USD&unit=toz`;
  
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch gold price. Status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log('API Response:', data);
  
      if (!data || !data.metals || typeof data.metals.gold === 'undefined') {
        throw new Error('Unexpected API response format');
      }
  
      const goldPriceUSD = data.metals.gold;
      console.log(`Current gold price (USD): $${goldPriceUSD.toFixed(2)}`);
      return goldPriceUSD.toFixed(2);
    } catch (error) {
      console.error('Error fetching gold price:', error);
      throw error;
    }
  };
  
  
  

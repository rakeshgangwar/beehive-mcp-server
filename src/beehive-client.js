const axios = require('axios');

class BeehiveClient {
  constructor(baseURL, apiKey) {
    this.baseURL = baseURL || process.env.BEEHIVE_URL || 'http://localhost:8181';
    
    // Set up default headers based on the browser's request
    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'X-Requested-With': 'XMLHttpRequest'
    };
    
    // Add API key header if provided
    // Note: Beehive doesn't use API keys by default
    // This is for custom authentication if you've implemented it
    if (apiKey || process.env.BEEHIVE_API_KEY) {
      headers['Authorization'] = `Bearer ${apiKey || process.env.BEEHIVE_API_KEY}`;
    }
    
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers,
      withCredentials: true // Include cookies in requests if needed
    });
  }

  // Get all available Hives (plugins)
  async getHives() {
    try {
      // Based on actual Beehive API endpoint structure
      const response = await this.client.get('/v1/hives');
      return response.data;
    } catch (error) {
      console.error('Error fetching hives:', error.message);
      throw error;
    }
  }

  // Get detailed information about a specific Hive
  async getHive(hiveName) {
    try {
      const response = await this.client.get(`/v1/hives/${hiveName}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching hive ${hiveName}:`, error.message);
      throw error;
    }
  }

  // Get all Bees (configured instances of Hives)
  async getBees() {
    try {
      const response = await this.client.get('/v1/bees');
      return response.data;
    } catch (error) {
      console.error('Error fetching bees:', error.message);
      throw error;
    }
  }

  // Get a specific Bee by ID
  async getBee(beeId) {
    try {
      const response = await this.client.get(`/v1/bees/${beeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching bee ${beeId}:`, error.message);
      throw error;
    }
  }

  // Create a new Bee
  async createBee(beeConfig) {
    try {
      // Wrap the bee config in a "bee" object as required by the Beehive API
      const payload = { bee: beeConfig };
      const response = await this.client.post('/v1/bees', payload);
      return response.data;
    } catch (error) {
      console.error('Error creating bee:', error.message);
      throw error;
    }
  }

  // Update an existing Bee
  async updateBee(beeId, beeConfig) {
    try {
      const response = await this.client.put(`/v1/bees/${beeId}`, beeConfig);
      return response.data;
    } catch (error) {
      console.error(`Error updating bee ${beeId}:`, error.message);
      throw error;
    }
  }

  // Delete a Bee
  async deleteBee(beeId) {
    try {
      const response = await this.client.delete(`/v1/bees/${beeId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting bee ${beeId}:`, error.message);
      throw error;
    }
  }

  // Get all Chains
  async getChains() {
    try {
      const response = await this.client.get('/v1/chains');
      return response.data;
    } catch (error) {
      console.error('Error fetching chains:', error.message);
      throw error;
    }
  }

  // Get a specific Chain by ID
  async getChain(chainId) {
    try {
      const response = await this.client.get(`/v1/chains/${chainId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching chain ${chainId}:`, error.message);
      throw error;
    }
  }

  // Create a new Chain
  async createChain(chainConfig) {
    try {
      const response = await this.client.post('/v1/chains', chainConfig);
      return response.data;
    } catch (error) {
      console.error('Error creating chain:', error.message);
      throw error;
    }
  }

  // Update an existing Chain
  async updateChain(chainId, chainConfig) {
    try {
      const response = await this.client.put(`/v1/chains/${chainId}`, chainConfig);
      return response.data;
    } catch (error) {
      console.error(`Error updating chain ${chainId}:`, error.message);
      throw error;
    }
  }

  // Delete a Chain
  async deleteChain(chainId) {
    try {
      const response = await this.client.delete(`/v1/chains/${chainId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting chain ${chainId}:`, error.message);
      throw error;
    }
  }

  // Manually trigger an action on a Bee
  async triggerAction(beeId, actionName, options) {
    try {
      const response = await this.client.post(`/v1/bees/${beeId}/actions/${actionName}`, options);
      return response.data;
    } catch (error) {
      console.error(`Error triggering action ${actionName} on bee ${beeId}:`, error.message);
      throw error;
    }
  }
}

module.exports = BeehiveClient;
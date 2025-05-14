const axios = require('axios');

/**
 * Client for interacting with the Beehive API
 */
class BeehiveClient {
  /**
   * Create a BeehiveClient
   * @param {string} baseUrl - Base URL for the Beehive API (e.g., http://localhost:8181)
   * @param {string} [apiKey] - Optional API key for authentication (not used by default in Beehive)
   */
  constructor(baseUrl = 'http://localhost:8181', apiKey = null) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    
    // Create an axios instance with default config
    this.axios = axios.create({
      baseURL: this.baseUrl,
      headers: this.apiKey ? {
        'Authorization': `Bearer ${this.apiKey}`
      } : {}
    });
  }

  /**
   * Get all available Hives (plugins)
   * @returns {Promise<Array>} - List of available Hives
   */
  async getHives() {
    try {
      const response = await this.axios.get('/v1/hives');
      return response.data;
    } catch (error) {
      this._handleError(error, 'Error fetching hives');
    }
  }

  /**
   * Get details of a specific Hive
   * @param {string} name - Name of the Hive
   * @returns {Promise<Object>} - Hive details
   */
  async getHive(name) {
    try {
      const response = await this.axios.get(`/v1/hives/${name}`);
      return response.data;
    } catch (error) {
      this._handleError(error, `Error fetching hive ${name}`);
    }
  }

  /**
   * Get all configured Bees
   * @returns {Promise<Array>} - List of configured Bees
   */
  async getBees() {
    try {
      const response = await this.axios.get('/v1/bees');
      return response.data;
    } catch (error) {
      this._handleError(error, 'Error fetching bees');
    }
  }

  /**
   * Get details of a specific Bee
   * @param {string} id - ID of the Bee
   * @returns {Promise<Object>} - Bee details
   */
  async getBee(id) {
    try {
      const response = await this.axios.get(`/v1/bees/${id}`);
      return response.data;
    } catch (error) {
      this._handleError(error, `Error fetching bee ${id}`);
    }
  }

  /**
   * Create a new Bee
   * @param {Object} config - Bee configuration
   * @param {string} config.name - Name for the Bee
   * @param {string} config.namespace - Hive namespace (the type of Hive to use)
   * @param {Object} config.options - Configuration options for the Bee
   * @returns {Promise<Object>} - Created Bee
   */
  async createBee(config) {
    try {
      const response = await this.axios.post('/v1/bees', config);
      return response.data;
    } catch (error) {
      this._handleError(error, 'Error creating bee');
    }
  }

  /**
   * Update an existing Bee
   * @param {string} id - ID of the Bee to update
   * @param {Object} config - Updated configuration
   * @returns {Promise<Object>} - Updated Bee
   */
  async updateBee(id, config) {
    try {
      const response = await this.axios.put(`/v1/bees/${id}`, config);
      return response.data;
    } catch (error) {
      this._handleError(error, `Error updating bee ${id}`);
    }
  }

  /**
   * Delete a Bee
   * @param {string} id - ID of the Bee to delete
   * @returns {Promise<Object>} - Deleted Bee
   */
  async deleteBee(id) {
    try {
      const response = await this.axios.delete(`/v1/bees/${id}`);
      return response.data;
    } catch (error) {
      this._handleError(error, `Error deleting bee ${id}`);
    }
  }

  /**
   * Get all configured Chains
   * @returns {Promise<Array>} - List of configured Chains
   */
  async getChains() {
    try {
      const response = await this.axios.get('/v1/chains');
      return response.data;
    } catch (error) {
      this._handleError(error, 'Error fetching chains');
    }
  }

  /**
   * Get details of a specific Chain
   * @param {string} id - ID of the Chain
   * @returns {Promise<Object>} - Chain details
   */
  async getChain(id) {
    try {
      const response = await this.axios.get(`/v1/chains/${id}`);
      return response.data;
    } catch (error) {
      this._handleError(error, `Error fetching chain ${id}`);
    }
  }

  /**
   * Create a new Chain
   * @param {Object} config - Chain configuration
   * @param {string} config.name - Name for the Chain
   * @param {Object} config.event - Event that triggers the chain
   * @param {Array} config.actions - Actions to perform
   * @param {Array} [config.filters=[]] - Filters to apply
   * @returns {Promise<Object>} - Created Chain
   */
  async createChain(config) {
    try {
      const response = await this.axios.post('/v1/chains', config);
      return response.data;
    } catch (error) {
      this._handleError(error, 'Error creating chain');
    }
  }

  /**
   * Update an existing Chain
   * @param {string} id - ID of the Chain to update
   * @param {Object} config - Updated configuration
   * @returns {Promise<Object>} - Updated Chain
   */
  async updateChain(id, config) {
    try {
      const response = await this.axios.put(`/v1/chains/${id}`, config);
      return response.data;
    } catch (error) {
      this._handleError(error, `Error updating chain ${id}`);
    }
  }

  /**
   * Delete a Chain
   * @param {string} id - ID of the Chain to delete
   * @returns {Promise<Object>} - Deleted Chain
   */
  async deleteChain(id) {
    try {
      const response = await this.axios.delete(`/v1/chains/${id}`);
      return response.data;
    } catch (error) {
      this._handleError(error, `Error deleting chain ${id}`);
    }
  }

  /**
   * Trigger an action on a Bee
   * @param {string} beeId - ID of the Bee
   * @param {string} actionName - Name of the action
   * @param {Object} options - Action parameters
   * @returns {Promise<Object>} - Action result
   */
  async triggerAction(beeId, actionName, options = {}) {
    try {
      const response = await this.axios.post(`/v1/bees/${beeId}/actions/${actionName}`, options);
      return response.data;
    } catch (error) {
      this._handleError(error, `Error triggering action ${actionName} on bee ${beeId}`);
    }
  }

  /**
   * Handle errors from API calls
   * @private
   * @param {Error} error - Error object
   * @param {string} message - Custom error message
   * @throws {Error} - Throws an error with details
   */
  _handleError(error, message) {
    // If it's an Axios error with a response, extract the data
    if (error.response) {
      const { status, data } = error.response;
      throw new Error(`${message}: ${status} - ${JSON.stringify(data)}`);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error(`${message}: No response received - ${error.message}`);
    } else {
      // Something happened in setting up the request
      throw new Error(`${message}: ${error.message}`);
    }
  }
}

module.exports = BeehiveClient;

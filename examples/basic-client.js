const axios = require('axios');

// Configuration
const MCP_SERVER_URL = 'http://localhost:3000';
// Note: You would typically load this from environment variables or a config file
const MCP_API_KEY = ''; // Optional, only needed if the Beehive instance requires authentication

/**
 * MCP Client class for interacting with the Beehive MCP server
 */
class BeehiveMCPClient {
  constructor(serverUrl, apiKey) {
    this.serverUrl = serverUrl || MCP_SERVER_URL;
    
    // Create headers
    const headers = {
      'Content-Type': 'application/json',
    };
    
    // Add API key if provided
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }
    
    this.client = axios.create({
      baseURL: this.serverUrl,
      timeout: 10000,
      headers
    });
  }

  /**
   * Get server metadata
   */
  async getMetadata() {
    try {
      const response = await this.client.get('/metadata');
      return response.data;
    } catch (error) {
      console.error('Error fetching metadata:', error.message);
      throw error;
    }
  }

  /**
   * Get available tools
   */
  async getTools() {
    try {
      const response = await this.client.get('/tools');
      return response.data;
    } catch (error) {
      console.error('Error fetching tools:', error.message);
      throw error;
    }
  }

  /**
   * Use a tool
   * @param {string} toolName - Name of the tool to use
   * @param {object} args - Arguments for the tool
   */
  async useTool(toolName, args = {}) {
    try {
      const response = await this.client.post(`/tools/${toolName}`, args);
      return response.data;
    } catch (error) {
      console.error(`Error using tool ${toolName}:`, error.message);
      throw error;
    }
  }
}

/**
 * Example usage of the Beehive MCP client
 */
async function runExample() {
  const client = new BeehiveMCPClient(MCP_SERVER_URL, MCP_API_KEY);

  try {
    // Get server metadata
    console.log('Fetching server metadata...');
    const metadata = await client.getMetadata();
    console.log('Server metadata:', metadata);
    console.log('---');

    // Get available tools
    console.log('Fetching available tools...');
    const tools = await client.getTools();
    console.log(`Available tools (${tools.length}):`);
    tools.forEach(tool => {
      console.log(`- ${tool.name}: ${tool.description}`);
    });
    console.log('---');

    // List all Hives
    console.log('Listing available Hives...');
    const hives = await client.useTool('list_hives');
    console.log(`Available Hives (${hives.length}):`);
    hives.forEach(hive => {
      console.log(`- ${hive.name}: ${hive.description}`);
    });
    console.log('---');

    // List all Bees
    console.log('Listing configured Bees...');
    const bees = await client.useTool('list_bees');
    console.log(`Configured Bees (${bees.length}):`);
    bees.forEach(bee => {
      console.log(`- ${bee.name} (${bee.hive}): ID ${bee.id}`);
    });
    console.log('---');

    // Example of creating a Bee (commented out to prevent actual creation)
    /*
    console.log('Creating a new Bee...');
    const newBee = await client.useTool('create_bee', {
      name: 'Sample RSS Feed',
      hive: 'rss',
      options: {
        url: 'https://example.com/feed.xml',
        refresh: 60
      }
    });
    console.log('Created Bee:', newBee);
    console.log('---');
    */

    // List all Chains
    console.log('Listing configured Chains...');
    const chains = await client.useTool('list_chains');
    console.log(`Configured Chains (${chains.length}):`);
    chains.forEach(chain => {
      console.log(`- ${chain.name}: ID ${chain.id}`);
    });

  } catch (error) {
    console.error('Error running example:', error.message);
  }
}

// Run the example if this script is executed directly
if (require.main === module) {
  console.log('Running Beehive MCP client example...');
  runExample();
}

module.exports = BeehiveMCPClient;
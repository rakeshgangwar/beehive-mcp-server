// Simple Beehive Automation Example

/**
 * This example shows how to create a simple automation using Beehive:
 * - A Cron Bee that triggers at specific times
 * - A Desktop Notification Bee that shows notifications
 * - A Chain that connects them
 */

// Sample code to create a Cron Bee
const createCronBee = async (beehiveClient) => {
  // Create a Cron Bee that triggers every minute
  const cronBee = await beehiveClient.createBee({
    name: "Minute Reminder",
    hive: "cronbee",
    options: {
      second: "0",   // Fire at 0 seconds
      minute: "*",   // Every minute
      hour: "*",     // Every hour
      day_of_week: "*", // Every day of week
      day_of_month: "*", // Every day of month
      month: "*"     // Every month
    }
  });
  
  console.log("Created Cron Bee:", cronBee);
  return cronBee;
};

// Sample code to create a Notification Bee
const createNotificationBee = async (beehiveClient) => {
  // Create a Desktop Notification Bee
  const notificationBee = await beehiveClient.createBee({
    name: "Desktop Alerts",
    hive: "notificationbee",
    options: {}
  });
  
  console.log("Created Notification Bee:", notificationBee);
  return notificationBee;
};

// Sample code to create a Chain that connects them
const createChain = async (beehiveClient, cronBee, notificationBee) => {
  // Create a Chain connecting the Cron event to the Notification action
  const chain = await beehiveClient.createChain({
    name: "Minute Reminder Notification",
    event: {
      bee: cronBee.id,
      name: "time"
    },
    actions: [
      {
        bee: notificationBee.id,
        name: "notify",
        options: {
          text: "One minute has passed! Time to stay productive!",
          urgency: "normal"
        }
      }
    ],
    filters: []
  });
  
  console.log("Created Chain:", chain);
  return chain;
};

// Main function to demonstrate the flow
const createAutomation = async () => {
  // In a real implementation, you would:
  const BeehiveClient = require('../src/beehive-client');
  const client = new BeehiveClient();
  
  try {
    // 1. Create the Cron Bee
    const cronBee = await createCronBee(client);
    
    // 2. Create the Notification Bee
    const notificationBee = await createNotificationBee(client);
    
    // 3. Connect them with a Chain
    const chain = await createChain(client, cronBee, notificationBee);
    
    console.log("Automation setup complete!");
    console.log("This would show a desktop notification every minute.");
  } catch (error) {
    console.error("Error creating automation:", error.message);
  }
};

// For demonstration purposes only
console.log("This is a demonstration script showing how to create a simple automation");
console.log("To run it with a working Beehive server, uncomment the next line:");
// createAutomation();
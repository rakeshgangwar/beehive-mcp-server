# Beehive API Documentation

This document outlines the Beehive API endpoints that the MCP server interacts with. This information is useful for developers who want to understand how the MCP server connects to Beehive or who want to extend the MCP server's functionality.

## Base URL

By default, Beehive's API is available at: `http://localhost:8181/v1`

## Authentication

### Default Behavior

Beehive's API doesn't require any authentication by default when accessed from localhost. This is because Beehive is designed to only listen on localhost interfaces (127.0.0.1) for security reasons. This makes the API accessible only from the local machine without authentication.

### Authentication Options for Production

For production use or when exposing Beehive to a network, it's strongly recommended to implement one of these security measures:

1. **Reverse Proxy with Authentication**: Place Beehive behind a reverse proxy like Nginx or Apache with authentication (Basic Auth, OAuth, etc.)

2. **SSH Tunneling**: Access Beehive remotely through an SSH tunnel to maintain the security of localhost-only access

3. **Custom Authentication**: You could modify Beehive to implement your own authentication mechanism like API keys

4. **Network Security**: Use firewalls, VPNs, or container networking to restrict access to the Beehive API

### Implementation Note

If you implement a custom authentication system, you would typically:

1. Add authentication to the Beehive server
2. Configure the MCP server's `.env` file with your API key
3. The MCP server is already set up to include an `Authorization: Bearer <token>` header when an API key is provided

The examples in this documentation assume the default localhost configuration without authentication.

## API Endpoints

### Hives

#### List all Hives

```
GET /v1/hives
```

Returns a list of all available Hives (plugins) that can be used to create Bees.

**Response Example:**
```json
[
  {
    "id": "rss",
    "name": "RSS",
    "description": "RSS feed reader",
    "options": [
      {
        "name": "url",
        "type": "string",
        "mandatory": true,
        "description": "URL of the RSS feed"
      },
      {
        "name": "refresh",
        "type": "int",
        "mandatory": false,
        "description": "Refresh interval in seconds"
      }
    ],
    "events": [
      {
        "name": "new_item",
        "description": "A new item was added to the feed",
        "options": []
      }
    ],
    "actions": []
  },
  {
    "id": "email",
    "name": "Email",
    "description": "Email hive",
    "options": [
      {
        "name": "username",
        "type": "string",
        "mandatory": true,
        "description": "SMTP username"
      },
      {
        "name": "password",
        "type": "string",
        "mandatory": true,
        "description": "SMTP password"
      },
      {
        "name": "server",
        "type": "string",
        "mandatory": true,
        "description": "SMTP server"
      },
      {
        "name": "port",
        "type": "int",
        "mandatory": false,
        "description": "SMTP port"
      }
    ],
    "events": [],
    "actions": [
      {
        "name": "send",
        "description": "Send an email",
        "options": [
          {
            "name": "recipient",
            "type": "string",
            "mandatory": true,
            "description": "Email recipient"
          },
          {
            "name": "subject",
            "type": "string",
            "mandatory": true,
            "description": "Email subject"
          },
          {
            "name": "text",
            "type": "string",
            "mandatory": true,
            "description": "Email body"
          }
        ]
      }
    ]
  }
]
```

#### Get Hive Details

```
GET /v1/hives/{hive_id}
```

Returns detailed information about a specific Hive.

**Response Example:**
```json
{
  "id": "twitter",
  "name": "Twitter",
  "description": "Twitter hive",
  "options": [
    {
      "name": "consumer_key",
      "type": "string",
      "mandatory": true,
      "description": "Twitter API consumer key"
    },
    {
      "name": "consumer_secret",
      "type": "string",
      "mandatory": true,
      "description": "Twitter API consumer secret"
    },
    {
      "name": "access_token",
      "type": "string",
      "mandatory": true,
      "description": "Twitter API access token"
    },
    {
      "name": "access_token_secret",
      "type": "string",
      "mandatory": true,
      "description": "Twitter API access token secret"
    }
  ],
  "events": [
    {
      "name": "tweet",
      "description": "New tweet from a followed user",
      "options": []
    },
    {
      "name": "mention",
      "description": "New mention of the authenticated user",
      "options": []
    }
  ],
  "actions": [
    {
      "name": "tweet",
      "description": "Post a new tweet",
      "options": [
        {
          "name": "text",
          "type": "string",
          "mandatory": true,
          "description": "Tweet text"
        }
      ]
    },
    {
      "name": "retweet",
      "description": "Retweet a tweet",
      "options": [
        {
          "name": "id",
          "type": "string",
          "mandatory": true,
          "description": "ID of the tweet to retweet"
        }
      ]
    }
  ]
}
```

### Bees

#### List all Bees

```
GET /v1/bees
```

Returns a list of all configured Bees.

**Response Example:**
```json
[
  {
    "id": "bee_1",
    "name": "My Twitter Account",
    "hive": "twitter",
    "options": {
      "consumer_key": "...",
      "consumer_secret": "...",
      "access_token": "...",
      "access_token_secret": "..."
    }
  },
  {
    "id": "bee_2",
    "name": "My Email Account",
    "hive": "email",
    "options": {
      "username": "user@example.com",
      "password": "...",
      "server": "smtp.example.com",
      "port": 587
    }
  }
]
```

#### Get Bee Details

```
GET /v1/bees/{bee_id}
```

Returns detailed information about a specific Bee.

**Response Example:**
```json
{
  "id": "bee_1",
  "name": "My Twitter Account",
  "hive": "twitter",
  "options": {
    "consumer_key": "...",
    "consumer_secret": "...",
    "access_token": "...",
    "access_token_secret": "..."
  }
}
```

#### Create Bee

```
POST /v1/bees
```

Creates a new Bee instance.

**Request Example:**
```json
{
  "name": "My RSS Feed",
  "hive": "rss",
  "options": {
    "url": "https://example.com/feed.xml",
    "refresh": 60
  }
}
```

**Response Example:**
```json
{
  "id": "bee_3",
  "name": "My RSS Feed",
  "hive": "rss",
  "options": {
    "url": "https://example.com/feed.xml",
    "refresh": 60
  }
}
```

#### Update Bee

```
PUT /v1/bees/{bee_id}
```

Updates an existing Bee.

**Request Example:**
```json
{
  "name": "Updated RSS Feed",
  "options": {
    "url": "https://example.com/updated-feed.xml",
    "refresh": 120
  }
}
```

**Response Example:**
```json
{
  "id": "bee_3",
  "name": "Updated RSS Feed",
  "hive": "rss",
  "options": {
    "url": "https://example.com/updated-feed.xml",
    "refresh": 120
  }
}
```

#### Delete Bee

```
DELETE /v1/bees/{bee_id}
```

Deletes a Bee instance.

**Response Example:**
```json
{
  "status": "success",
  "message": "Bee deleted"
}
```

### Chains

#### List all Chains

```
GET /v1/chains
```

Returns a list of all configured Chains.

**Response Example:**
```json
[
  {
    "id": "chain_1",
    "name": "Tweet to Email",
    "event": {
      "bee": "bee_1",
      "name": "tweet"
    },
    "actions": [
      {
        "bee": "bee_2",
        "name": "send",
        "options": {
          "recipient": "recipient@example.com",
          "subject": "New Tweet",
          "text": "{{.user}} tweeted: {{.text}}"
        }
      }
    ],
    "filters": []
  }
]
```

#### Get Chain Details

```
GET /v1/chains/{chain_id}
```

Returns detailed information about a specific Chain.

**Response Example:**
```json
{
  "id": "chain_1",
  "name": "Tweet to Email",
  "event": {
    "bee": "bee_1",
    "name": "tweet"
  },
  "actions": [
    {
      "bee": "bee_2",
      "name": "send",
      "options": {
        "recipient": "recipient@example.com",
        "subject": "New Tweet",
        "text": "{{.user}} tweeted: {{.text}}"
      }
    }
  ],
  "filters": []
}
```

#### Create Chain

```
POST /v1/chains
```

Creates a new Chain.

**Request Example:**
```json
{
  "name": "RSS to Twitter",
  "event": {
    "bee": "bee_3",
    "name": "new_item"
  },
  "actions": [
    {
      "bee": "bee_1",
      "name": "tweet",
      "options": {
        "text": "New article: {{.title}} {{index .links 0}}"
      }
    }
  ],
  "filters": [
    {
      "type": "contains",
      "field": "title",
      "value": "important"
    }
  ]
}
```

**Response Example:**
```json
{
  "id": "chain_2",
  "name": "RSS to Twitter",
  "event": {
    "bee": "bee_3",
    "name": "new_item"
  },
  "actions": [
    {
      "bee": "bee_1",
      "name": "tweet",
      "options": {
        "text": "New article: {{.title}} {{index .links 0}}"
      }
    }
  ],
  "filters": [
    {
      "type": "contains",
      "field": "title",
      "value": "important"
    }
  ]
}
```

#### Update Chain

```
PUT /v1/chains/{chain_id}
```

Updates an existing Chain.

**Request Example:**
```json
{
  "name": "Updated RSS to Twitter",
  "filters": [
    {
      "type": "contains",
      "field": "title",
      "value": "critical"
    }
  ]
}
```

**Response Example:**
```json
{
  "id": "chain_2",
  "name": "Updated RSS to Twitter",
  "event": {
    "bee": "bee_3",
    "name": "new_item"
  },
  "actions": [
    {
      "bee": "bee_1",
      "name": "tweet",
      "options": {
        "text": "New article: {{.title}} {{index .links 0}}"
      }
    }
  ],
  "filters": [
    {
      "type": "contains",
      "field": "title",
      "value": "critical"
    }
  ]
}
```

#### Delete Chain

```
DELETE /v1/chains/{chain_id}
```

Deletes a Chain.

**Response Example:**
```json
{
  "status": "success",
  "message": "Chain deleted"
}
```

### Actions

#### Trigger Action

```
POST /v1/bees/{bee_id}/actions/{action_name}
```

Manually triggers an action on a Bee.

**Request Example:**
```json
{
  "recipient": "user@example.com",
  "subject": "Test Email",
  "text": "This is a test email sent via Beehive API"
}
```

**Response Example:**
```json
{
  "status": "success",
  "message": "Action triggered"
}
```

## Error Handling

Beehive API returns standard HTTP status codes:

- 200: Success
- 400: Bad Request (invalid parameters)
- 404: Not Found (resource doesn't exist)
- 500: Internal Server Error

Error responses include a message explaining the error:

```json
{
  "error": "Bee not found"
}
```

## Templating in Actions

Beehive uses Go's templating system for action options. Event data can be referenced using this templating syntax:

- `{{.field}}` - Access a field from the event data
- `{{index .array_field index}}` - Access an element in an array
- `{{.nested.field}}` - Access a nested field

For example, in an RSS to Email chain, you could use:

```
Subject: New Article: {{.title}}
Body: {{.description}}
Link: {{index .links 0}}
```

## Filters

Filters determine whether an action should be executed based on the event data. Available filter types:

- `contains`: Checks if a field contains a value
- `equals`: Checks if a field equals a value
- `startswith`: Checks if a field starts with a value
- `endswith`: Checks if a field ends with a value
- `regex`: Checks if a field matches a regex pattern

Filters can be combined, and all must pass for the actions to be executed.
/**
 * OpenAPI 3.0 Specification for GearShift REST API
 */
const openApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'GearShift Dealership Inventory API',
    version: '1.0.0',
    description: 'REST API documentation for GearShift car dealership inventory system featuring clean architecture, RBAC, and inventory management.'
  },
  servers: [
    {
      url: '/api',
      description: 'API Base Server'
    }
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT authorization header using Bearer scheme.'
      }
    },
    schemas: {
      Vehicle: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
          make: { type: 'string', example: 'Honda' },
          model: { type: 'string', example: 'Civic' },
          category: {
            type: 'string',
            enum: ['SEDAN', 'SUV', 'HATCHBACK', 'TRUCK', 'SPORTS', 'LUXURY', 'ELECTRIC', 'HYBRID'],
            example: 'SEDAN'
          },
          price: { type: 'number', example: 24000 },
          quantity: { type: 'integer', example: 10 },
          createdBy: { type: 'string', example: '60d0fe4f5311236168a109cb' }
        }
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '60d0fe4f5311236168a109cb' },
          name: { type: 'string', example: 'Admin Manager' },
          email: { type: 'string', example: 'admin@example.com' },
          role: { type: 'string', enum: ['user', 'staff', 'admin'], example: 'admin' }
        }
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string', example: 'Error message' },
          error: { type: 'string', example: 'Error message' }
        }
      }
    }
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Authentication'],
        summary: 'Register a new user account',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Admin User' },
                  email: { type: 'string', example: 'admin@example.com' },
                  password: { type: 'string', example: 'Password123!' },
                  role: { type: 'string', enum: ['user', 'staff', 'admin'], example: 'admin' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'User created successfully' },
          400: { description: 'Validation error' },
          409: { description: 'Email already exists' }
        }
      }
    },
    '/auth/login': {
      post: {
        tags: ['Authentication'],
        summary: 'Authenticate user and obtain JWT token',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', example: 'admin@example.com' },
                  password: { type: 'string', example: 'Password123!' }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Authentication successful' },
          401: { description: 'Invalid credentials' }
        }
      }
    },
    '/auth/me': {
      get: {
        tags: ['Authentication'],
        summary: 'Get currently authenticated user profile',
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: 'Profile retrieved successfully' },
          401: { description: 'Unauthorized' }
        }
      }
    },
    '/vehicles': {
      get: {
        tags: ['Vehicles'],
        summary: 'List all vehicles in inventory',
        responses: {
          200: { description: 'List of vehicles retrieved' }
        }
      },
      post: {
        tags: ['Vehicles'],
        summary: 'Create a new vehicle (Staff/Admin only)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['make', 'model', 'category', 'price', 'quantity'],
                properties: {
                  make: { type: 'string', example: 'Honda' },
                  model: { type: 'string', example: 'Civic' },
                  category: { type: 'string', example: 'SEDAN' },
                  price: { type: 'number', example: 24000 },
                  quantity: { type: 'integer', example: 10 }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Vehicle created successfully' },
          401: { description: 'Unauthorized' },
          403: { description: 'Forbidden (insufficient permissions)' }
        }
      }
    },
    '/vehicles/search': {
      get: {
        tags: ['Vehicles'],
        summary: 'Search vehicle inventory by filters',
        parameters: [
          { name: 'make', in: 'query', schema: { type: 'string' } },
          { name: 'model', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'minPrice', in: 'query', schema: { type: 'number' } },
          { name: 'maxPrice', in: 'query', schema: { type: 'number' } }
        ],
        responses: {
          200: { description: 'Matching vehicles returned' }
        }
      }
    },
    '/vehicles/{id}': {
      put: {
        tags: ['Vehicles'],
        summary: 'Update vehicle by ID (Staff/Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Vehicle' }
            }
          }
        },
        responses: {
          200: { description: 'Vehicle updated' },
          404: { description: 'Vehicle not found' }
        }
      },
      delete: {
        tags: ['Vehicles'],
        summary: 'Delete vehicle by ID (Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Vehicle deleted' },
          403: { description: 'Forbidden (Admin required)' }
        }
      }
    },
    '/vehicles/{id}/purchase': {
      post: {
        tags: ['Inventory'],
        summary: 'Purchase vehicle (reduce stock by 1)',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Purchase successful' },
          400: { description: 'Out of stock' },
          404: { description: 'Vehicle not found' }
        }
      }
    },
    '/vehicles/{id}/restock': {
      post: {
        tags: ['Inventory'],
        summary: 'Restock vehicle inventory (Staff/Admin only)',
        security: [{ bearerAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['quantity'],
                properties: {
                  quantity: { type: 'integer', example: 5 }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Restock successful' }
        }
      }
    }
  }
};

module.exports = openApiSpec;

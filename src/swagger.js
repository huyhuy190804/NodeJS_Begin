import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "User API Documentation",
      version: "1.0.0",
      description: "API documentation for User Management System",
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },
    servers: [
      {
        url: dotenv.config().parsed.URL_API,
        description: "Development Server",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          required: ["name", "email"],
          properties: {
            _id: {
              type: "string",
              description: "User ID (MongoDB Object ID)",
              example: "507f1f77bcf86cd799439011",
            },
            name: {
              type: "string",
              description: "User's full name",
              example: "Nguyễn Văn A",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address (unique)",
              example: "user@example.com",
            },
            age: {
              type: "number",
              description: "User's age",
              example: 25,
              default: 18,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              description: "User creation timestamp",
              example: "2024-03-11T10:30:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              description: "User last update timestamp",
              example: "2024-03-11T10:30:00Z",
            },
          },
        },
        CreateUserRequest: {
          type: "object",
          required: ["name", "email"],
          properties: {
            name: {
              type: "string",
              description: "User's full name",
              example: "Nguyễn Văn A",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
              example: "user@example.com",
            },
            age: {
              type: "number",
              description: "User's age (optional, default: 18)",
              example: 25,
            },
          },
        },
        UpdateUserRequest: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "User's full name",
              example: "Nguyễn Văn B",
            },
            email: {
              type: "string",
              format: "email",
              description: "User's email address",
              example: "newemail@example.com",
            },
            age: {
              type: "number",
              description: "User's age",
              example: 30,
            },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Operation was successful",
            },
            data: {
              oneOf: [
                { $ref: "#/components/schemas/User" },
                {
                  type: "array",
                  items: { $ref: "#/components/schemas/User" },
                },
              ],
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              example: "Error description",
            },
          },
        },
      },
    },
  },
  apis: [], // Sẽ để trống vì chúng ta viết định nghĩa path ở dưới
};

const swaggerSpec = swaggerJsdoc(options);

// Thêm các path definition trực tiếp vào spec
swaggerSpec.paths = {
  "/api/users": {
    get: {
      summary: "Get all users",
      description: "Retrieve a list of all users in the system",
      tags: ["Users"],
      responses: {
        200: {
          description: "Successfully retrieved all users",
          content: {
            "application/json": {
              schema: {
                type: "array",
                items: { $ref: "#/components/schemas/User" },
              },
              example: [
                {
                  _id: "507f1f77bcf86cd799439011",
                  name: "Nguyễn Văn A",
                  email: "user1@example.com",
                  age: 25,
                  createdAt: "2024-03-11T10:30:00Z",
                  updatedAt: "2024-03-11T10:30:00Z",
                },
                {
                  _id: "507f1f77bcf86cd799439012",
                  name: "Trần Thị B",
                  email: "user2@example.com",
                  age: 28,
                  createdAt: "2024-03-11T10:35:00Z",
                  updatedAt: "2024-03-11T10:35:00Z",
                },
              ],
            },
          },
        },
        500: {
          description: "Server error",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
    post: {
      summary: "Create a new user",
      description: "Create a new user in the system",
      tags: ["Users"],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CreateUserRequest" },
            example: {
              name: "Hoàng Văn C",
              email: "hoang@example.com",
              age: 30,
            },
          },
        },
      },
      responses: {
        201: {
          description: "User created successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Tạo user thành công",
                  },
                  data: { $ref: "#/components/schemas/User" },
                },
              },
              example: {
                message: "Tạo user thành công",
                data: {
                  _id: "507f1f77bcf86cd799439013",
                  name: "Hoàng Văn C",
                  email: "hoang@example.com",
                  age: 30,
                  createdAt: "2024-03-11T10:40:00Z",
                  updatedAt: "2024-03-11T10:40:00Z",
                },
              },
            },
          },
        },
        500: {
          description: "Server error",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },
  "/api/users/{id}": {
    get: {
      summary: "Get user by ID",
      description: "Retrieve a specific user by their ID",
      tags: ["Users"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "User ID",
          schema: {
            type: "string",
            example: "507f1f77bcf86cd799439011",
          },
        },
      ],
      responses: {
        200: {
          description: "User found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/User" },
              example: {
                _id: "507f1f77bcf86cd799439011",
                name: "Nguyễn Văn A",
                email: "user1@example.com",
                age: 25,
                createdAt: "2024-03-11T10:30:00Z",
                updatedAt: "2024-03-11T10:30:00Z",
              },
            },
          },
        },
        404: {
          description: "User not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: {
                message: "Không tìm thấy user",
              },
            },
          },
        },
        500: {
          description: "Server error",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
    put: {
      summary: "Update user",
      description: "Update an existing user's information",
      tags: ["Users"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "User ID",
          schema: {
            type: "string",
            example: "507f1f77bcf86cd799439011",
          },
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/UpdateUserRequest" },
            example: {
              name: "Nguyễn Văn A Updated",
              email: "updated@example.com",
              age: 26,
            },
          },
        },
      },
      responses: {
        200: {
          description: "User updated successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Update thành công",
                  },
                  data: { $ref: "#/components/schemas/User" },
                },
              },
              example: {
                message: "Update thành công",
                data: {
                  _id: "507f1f77bcf86cd799439011",
                  name: "Nguyễn Văn A Updated",
                  email: "updated@example.com",
                  age: 26,
                  createdAt: "2024-03-11T10:30:00Z",
                  updatedAt: "2024-03-11T11:00:00Z",
                },
              },
            },
          },
        },
        404: {
          description: "User not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        500: {
          description: "Server error",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
    delete: {
      summary: "Delete user",
      description: "Delete a user from the system",
      tags: ["Users"],
      parameters: [
        {
          name: "id",
          in: "path",
          required: true,
          description: "User ID",
          schema: {
            type: "string",
            example: "507f1f77bcf86cd799439011",
          },
        },
      ],
      responses: {
        200: {
          description: "User deleted successfully",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: {
                    type: "string",
                    example: "Xóa thành công",
                  },
                },
              },
              example: {
                message: "Xóa thành công",
              },
            },
          },
        },
        404: {
          description: "User not found",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
        500: {
          description: "Server error",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
            },
          },
        },
      },
    },
  },
};

export { swaggerSpec, swaggerUi };

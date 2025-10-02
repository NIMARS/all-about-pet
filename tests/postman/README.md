# Postman API Tests

This directory contains Postman collections for testing the AllAboutPet API.

## Structure

```
tests/postman/
├── collections/          # Postman collections
│   ├── All About Pet API.postman_collection.json
│   └── environment.json
├── scripts/             # Newman scripts for CI/CD
└── README.md           # This file
```

## Running Tests

### Using Postman
1. Import the collection file into Postman
2. Set up environment variables
3. Run the collection

### Using Newman (CLI)
```bash
# Install Newman globally
npm install -g newman

# Run tests
newman run "tests/postman/collections/All About Pet API.postman_collection.json" \
  -e "tests/postman/environment.json" \
  --reporters cli,json \
  --reporter-json-export results.json
```

## Environment Variables

Create a `environment.json` file with the following variables:
- `baseUrl`: API base URL (e.g., http://localhost:5000)
- `token`: JWT token for authenticated requests
- `userId`: Test user ID
- `petId`: Test pet ID

## Test Categories

1. **Authentication Tests**
   - Login
   - Register
   - Token validation

2. **User Management Tests**
   - Get user profile
   - Update user profile
   - Delete user

3. **Pet Management Tests**
   - Create pet
   - Get pets
   - Update pet
   - Delete pet

4. **Event Management Tests**
   - Create event
   - Get events
   - Update event
   - Delete event

5. **Document Management Tests**
   - Upload document
   - Get documents
   - Delete document 
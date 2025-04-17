# Use Node base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Expose port (same as what Fastify listens on)
EXPOSE 3000

# Start the app
CMD ["npm", "run", "dev"]

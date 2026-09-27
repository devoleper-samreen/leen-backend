FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY shared ./shared
COPY services/auth-service ./services/auth-service
WORKDIR /app/services/auth-service
RUN npm install
EXPOSE 4001
CMD ["npm", "run", "dev"]

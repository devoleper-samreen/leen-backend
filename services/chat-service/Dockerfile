FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY shared ./shared
COPY services/chat-service ./services/chat-service
WORKDIR /app/services/chat-service
RUN npm install
EXPOSE 4005
CMD ["npm", "run", "dev"]

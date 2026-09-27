FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY shared ./shared
COPY services/support-dispute-service ./services/support-dispute-service
WORKDIR /app/services/support-dispute-service
RUN npm install
EXPOSE 4006
CMD ["npm", "run", "dev"]

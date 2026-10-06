FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY tsconfig.base.json ./
COPY shared ./shared
COPY services/payment-service ./services/payment-service
WORKDIR /app/services/payment-service
RUN npm install
EXPOSE 4004
CMD ["npm", "run", "dev"]

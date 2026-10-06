FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
COPY tsconfig.base.json ./
COPY shared ./shared
COPY services/booking-service ./services/booking-service
WORKDIR /app/services/booking-service
RUN npm install
EXPOSE 4003
CMD ["npm", "run", "dev"]

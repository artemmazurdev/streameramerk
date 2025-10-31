FROM node:18-alpine

# Install build dependencies for Mediasoup
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    gcc \
    linux-headers

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 6000 40000-49999/udp 40000-49999/tcp

CMD ["npm", "run", "dev"]




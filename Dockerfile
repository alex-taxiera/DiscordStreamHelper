FROM node:12-alpine

RUN apk add --no-cache git; mkdir -p /streamer
WORKDIR /streamer

COPY . .
RUN npm ci --only=prod --no-optional

#CMD ["npm", "start"]
CMD ["sh", "-c", "sleep infinity"]

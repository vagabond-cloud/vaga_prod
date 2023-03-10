# Install dependencies only when needed
FROM node:18 AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.


WORKDIR /app
COPY package.json yarn.lock ./

RUN yarn install

# Rebuild the source code only when needed
FROM node:18 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn add prisma
RUN yarn add @prisma/client
RUN yarn build

# Production image, copy all the files and run next
# Production image, copy all the files and run next
FROM node:18 AS runner


WORKDIR /app

ENV NODE_ENV production

# RUN addgroup -g 1001 -S nodejs
# RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
# COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/build ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# USER nextjs

EXPOSE 8080

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
ENV NEXT_TELEMETRY_DISABLED 1

# CMD ["yarn", "start"]
CMD ["yarn", "start"]
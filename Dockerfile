# Install dependencies only when needed
FROM node:16 AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.

WORKDIR /app
COPY package.json yarn.lock ./


#  add libraries; sudo so non-root user added downstream can get sudo
# RUN apk add --no-cache libc6-compat
# RUN apk add --no-cache git
# RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

# RUN apk add --no-cache py3-pip
# RUN apk add --no-cache py3-setuptools

# RUN apk add --no-cache \
#     build-base \
#     g++ \
#     cairo-dev \
#     jpeg-dev \
#     pango-dev \
#     bash \
#     imagemagick


RUN yarn install


# Rebuild the source code only when needed
FROM node:16 AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# Production image, copy all the files and run next
# Production image, copy all the files and run next
FROM node:16 AS runner
WORKDIR /app

# RUN apk add --no-cache libc6-compat
# RUN apk add --no-cache git
# RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

# RUN apk add --no-cache py3-pip
# RUN apk add --no-cache py3-setuptools

# RUN apk add --no-cache \
#     build-base \
#     g++ \
#     cairo-dev \
#     jpeg-dev \
#     pango-dev \
#     bash \
#     imagemagick



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
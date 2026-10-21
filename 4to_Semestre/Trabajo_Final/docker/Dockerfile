FROM node:22-alpine

RUN corepack enable && corepack prepare pnpm@latest --activate

# directorio de trabajo dentro del contenedor
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml* .npmrc* ./

RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 4000

CMD ["pnpm", "run", "start"]

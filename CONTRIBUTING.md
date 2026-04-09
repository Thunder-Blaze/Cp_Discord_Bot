# Contributing to CP Discord Bot

Thanks for considering a contribution.
This guide explains how to set up the project, make changes safely, and open a high-quality pull request.

## Development Setup

### Prerequisites

- Node.js 18+
- npm
- A Discord application and bot token

### Local Setup

1. Fork the repository on GitHub.
2. Clone your fork:

```bash
git clone https://github.com/<your-username>/Cp_Discord_Bot.git
cd Cp_Discord_Bot
```

3. Add the original repository as `upstream` (recommended):

```bash
git remote add upstream https://github.com/Thunder-Blaze/Cp_Discord_Bot.git
```

4. Install dependencies:

```bash
npm install
```

5. Create a `.env` file in the project root:

```env
BOT_TOKEN=your_discord_token_here
GUILD_ID=your_discord_server_id
CLIENT_ID=your_discord_application_client_id
# optional for custom Chromium location in Docker/servers
PUPPETEER_EXECUTABLE_PATH=
```

6. Register slash commands:

```bash
npm run deploy
```

7. Start the bot:

```bash
npm run start
```

## Docker Setup and Run

Use this when running the bot in a containerized environment.

1. Build the Docker image:

```bash
docker build -t cp-discord-bot .
```

2. Run the container with your `.env` file:

```bash
docker run -d --env-file .env cp-discord-bot
```

3. Check logs if needed:

```bash
docker logs -f <container-id>
```

## Project Structure

- `index.js`: bot entry point, dynamic loading for commands/events
- `deploy-commands.js`: slash command registration
- `commands/`: slash command implementations
- `events/`: Discord event handlers
- `database/`: SQLite data access helpers
- `data/`: runtime DB files

## Code Style and Quality

Run formatting and lint checks before opening a PR:

```bash
npm run format
npm run lint
```

Keep changes focused and avoid mixing refactors with feature work unless needed.

## Branch and Commit Guidelines

- Create a feature/fix branch from `main`.
- Use clear commit messages, for example:
    - `fix(cfverify): validate CE submission timestamp correctly`
    - `feat(database): add unique index for platform/member pair`

## Pull Request Checklist

Before opening a PR, confirm:

- Code builds and bot starts locally
- `npm run lint` passes
- New behavior is documented in README or command help text if needed
- You tested the changed command/event flow on a Discord test server
- PR description includes:
    - What changed
    - Why it changed
    - How to test

## Reporting Bugs and Requesting Features

When opening an issue, include:

- Reproduction steps
- Expected vs actual behavior
- Logs/errors (remove sensitive tokens)
- Environment details (OS, Node version, Docker/non-Docker)

## Security

Do not commit secrets (`BOT_TOKEN`, API keys, cookies, session data).
If you discover a serious security issue, open a private report with maintainers instead of posting full exploit details publicly.

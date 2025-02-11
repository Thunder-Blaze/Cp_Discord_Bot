# Codeforces Verification Discord Bot

## Overview
- Currently Supports Codechef and Codeforces
- This bot fetches user data from cp platforms and display it on discord.
- This bot also verifies Codeforces users on Discord by checking their submissions and assigning them roles based on their rank.

## Features

#### Codeforces
- Users can verify their Codeforces account using `/cfverify <handle>` and get assigned the respective rank role.
- You can fetch Codeforce's Profile's Image using `/cfuserpfp <handle>`.
- Retrieves and displays Codeforces user stats via `/cfuserinfo <handle>`.

#### CodeChef
- You can fetch Codeforce's Profile's Image using `/ccuserpfp <handle>`.
- Retrieves and displays user stats via `/ccuserinfo <handle>`.

## Installation
### Requirements
- Node.js
- Required Node packages (listed in `package.json`)
- A Discord bot token

### Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/Thunder-Blaze/Cp_Discord_Bot.git
   cd Cp_Discord_Bot
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and add:
   ```ini
   BOT_TOKEN=your_discord_token_here #important
   GUILD_ID=your_discord_server_id #important
   CLIENT_ID="1338648033981759549"
   ```
4. Install Commands in Server:
   ```sh
   node run deploy
   ```
4. Run the bot:
   ```sh
   node run start
   ```

## Docker Deployment
### Build and Run with Docker
1. Build the Docker image:
   ```sh
   docker build -t cp-discord-bot .
   ```
2. Run the container:
   ```sh
   docker run -d --env-file .env cp-discord-bot
   ```

## Caution
- Ensure your `.env` file contains a valid Discord bot token.
- The bot requires proper permissions to assign roles in your Discord server.

## Info
- Created by: **Shivansh Jain**

# **<a>CP Discord Bot</a>** <i><small>in Node JS</small></i>

## Overview

- Currently Supports Codechef and Codeforces
- This bot fetches user data from cp platforms and display it on discord.
- This bot also verifies Codeforces & CodeChef users on Discord by checking their submissions and assigning them roles based on their titles.

## Features

#### Codeforces

- Users can verify their Codeforces account using `/cfverify <handle>` and get assigned the respective rank role.
- You can fetch Codeforce's Profile's Image using `/cfuserpfp <handle>`.
- Retrieves and displays Codeforces user stats via `/cfuserinfo <handle>`.
- Retrieves Detailed Data about Solved Questions by the user using `/cfusersolved <handle>`.

#### CodeChef

- Users can verify their CodeChef account using `/ccverify <handle>` and get assigned the respective rank role.
- You can fetch Codeforce's Profile's Image using `/ccuserpfp <handle>`.
- Retrieves and displays user stats via `/ccuserinfo <handle>`.

## Screenshots
<img src="https://github.com/user-attachments/assets/9442d0b2-2188-46b1-94e5-41edffe03ce7" width="49%">
<img src="https://github.com/user-attachments/assets/48cb069c-01fd-4455-b43c-95ee58e5ea6f" width="49%">
<img src="https://github.com/user-attachments/assets/bdae37e0-f1f4-4b7a-97ad-e984fc4aa72f" width="49%">
<img src="https://github.com/user-attachments/assets/2b2aae65-11d3-4c0f-af35-6bfd85976cb5" width="49%">
<img src="https://github.com/user-attachments/assets/978e0d58-2065-4f82-bbad-3dd39eefd1d4" width="49%">
<img src="https://github.com/user-attachments/assets/1dfc0595-8fb6-4e1b-9dce-bc5ec684c585" width="49%">
<img src="https://github.com/user-attachments/assets/bb089be2-8d83-42e7-a80e-d22c898eb8d7" width="49%">
<img src="https://github.com/user-attachments/assets/6a22ee40-f897-49a2-87d9-7f9c6a2323e6" width="49%">



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
    CLIENT_ID=your_discord_bot_client_id #important
    ```
4. Install Commands in Server:
    ```sh
    node run deploy
    ```
5. Run the bot:
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
- Also check out the same project but with Python: [In-Saiyan/CodeForces-Discord-Verification](https://github.com/In-Saiyan/CodeForces-Discord-Verification)

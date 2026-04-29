# TikTok VPS Backend

A dedicated Node.js backend using `yt-dlp` and `ffmpeg` to reliably download and process TikTok videos.
This ensures output files are highly compatible (H264 + AAC MP4) avoiding any "black screen" or "audio-only" bugs.

## Prerequisites & Installation (Ubuntu VPS)

Run the following commands on your Ubuntu server to install all required system dependencies:

```bash
# 1. Update packages
sudo apt update

# 2. Install Python3, pip, and ffmpeg
sudo apt install python3 python3-pip ffmpeg -y

# 3. Install yt-dlp via pip (this ensures you get the latest version)
sudo rm /usr/lib/python3.11/EXTERNALLY-MANAGED # Only if required on Ubuntu 23.04+
pip3 install -U yt-dlp

# 4. Install Node.js (via NodeSource for latest LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 5. Install PM2 globally
sudo npm install -g pm2
```

## Application Setup

1. **Copy** this `vps-backend` folder to your VPS.
2. **Install node modules**:
   ```bash
   cd vps-backend
   npm install
   ```
3. **Configure Environment**:
   ```bash
   cp .env.example .env
   ```
   *Edit the `.env` file and set `BASE_URL` to your server's public IP or Domain name (e.g. `http://203.0.113.10:4000`).*

## Running the Server

Start the application with PM2:

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

Your backend will now be running on port `4000`.

## Features
- **yt-dlp**: Automatically grabs the best video/audio streams.
- **ffmpeg**: Normalizes format to prevent playback errors on mobile/web.
- **Rate Limiting**: Protects your endpoint from abuse.
- **Auto-Cleanup**: Runs every 15 minutes to delete files older than 30 minutes, saving your disk space.

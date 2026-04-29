module.exports = {
  apps: [{
    name: "tiktok-vps-backend",
    script: "./server.js",
    instances: "max",
    exec_mode: "cluster",
    watch: false,
    max_memory_restart: "1G",
    env: {
      NODE_ENV: "production",
      PORT: 4000
    }
  }]
};

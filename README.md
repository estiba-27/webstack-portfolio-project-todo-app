# Simple todo App developed by team EETA

A modern Todo application built with **React**, **TypeScript**, and **Tailwind CSS**, deployed with **Nginx** and managed via a **CI/CD pipeline**.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Local Setup](#local-setup)
4. [Server Setup](#server-setup)
5. [CI/CD Pipeline](#cicd-pipeline)
6. [Nginx & Domain Setup](#nginx--domain-setup)
7. [Live App](#live-app)

---

## Project Overview

Smart Todo App is a productivity-focused application to manage tasks efficiently. The frontend is built with **, deployed on a Linux server with **Nginx** and **HTTPS** support.

---

## Features

* Add, edit, and delete tasks
* Mark tasks as completed
* Responsive and clean UI
* Live updates via CI/CD deployment

---

## Local Setup

1. Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

2. Install dependencies:

```bash
npm install
```

3. Run development server:

```bash
npm run dev -- --host 0.0.0.0 --port 5173
```

4. Open in browser:

```
http://localhost:5173
```

---

## Server Setup

1. SSH into the server:

```bash
ssh user@YOUR_SERVER_IP
```

2. Update system packages:

```bash
sudo apt update && sudo apt upgrade -y
```

3. Install Node.js and npm:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

4. Pull the code and install dependencies:

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
npm install
```

5. (Optional) Start app temporarily in development mode:

```bash
npm run dev -- --host 0.0.0.0 --port 5173
```

---

## CI/CD Pipeline

1. **Push changes to GitHub**:

```bash
git add .
git commit -m "Update feature"
git push origin main
```

2. **GitHub Actions workflow** triggers automatically:

   * Pulls latest code to the server
   * Installs dependencies
   * Restarts the application (via PM2 or chosen process manager)

3. **Verify deployment**:

   * Check the server IP or domain in browser
   * Ensure latest changes appear

---

## Nginx & Domain Setup

1. **Install Nginx**:

```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

2. **Create Nginx site config** at `/etc/nginx/sites-available/todo-app`:

```nginx
server {
    listen 80;
    server_name devops.task.odoo.et;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

3. **Enable site and reload Nginx**:

```bash
sudo ln -s /etc/nginx/sites-available/todo-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

4. **Set up HTTPS (Let’s Encrypt)**:

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d devops.task.odoo.et
```

* Choose HTTP → HTTPS redirection when prompted
* Verify HTTPS at `https://devops.task.odoo.et`

5. **Check auto-renewal**:

```bash
sudo certbot renew --dry-run
```

---

## Live App

* **IP Access:** `http://YOUR_SERVER_IP:5173`
* **Domain (HTTPS):** `https://devops.task.odoo.et`

---

This README provides **server setup, pipeline workflow, and Nginx/domain configuration** for easy deployment and verification.



# Login Page – EC2 Deployment Guide

This document explains how to deploy the **Login Page web application** on **AWS EC2** with **AWS S3 used for storing user data (`users.json`)**.

The backend is a **Node.js Express server**, and the frontend is static HTML/CSS/JS served by the same server.

---

# 1. Launch EC2 Instance

Go to **AWS Console → EC2 → Launch Instance**

Recommended settings:

| Setting        | Value                         |
| -------------- | ----------------------------- |
| AMI            | Amazon Linux 2023             |
| Instance type  | t2.micro                      |
| Key pair       | Create or select existing     |
| Security group | Allow SSH + HTTP + Custom TCP |

Inbound rules:

| Type       | Port |
| ---------- | ---- |
| SSH        | 22   |
| HTTP       | 80   |
| Custom TCP | 3000 |

Launch the instance.

---

# 2. Connect to EC2

From your terminal:

```bash
ssh -i your-key.pem ec2-user@YOUR_PUBLIC_IP
```

Example:

```bash
ssh -i awskey.pem ec2-user@65.xx.xx.xx
```

---

# 3. Update the System

```bash
sudo dnf update -y
```

---

# 4. Install Required Software

Install Node.js and Git:

```bash
sudo dnf install nodejs git -y
```

Verify installation:

```bash
node -v
npm -v
git --version
```

---

# 5. Clone the Project

```bash
git clone https://github.com/<your-username>/Login_Page.git
cd Login_Page
```

---

# 6. Install Dependencies

```bash
npm install
```

---

# 7. Configure Environment Variables

Create the `.env` file:

```bash
nano .env
```

Add the following:

```env
PORT=3000
JWT_SECRET=replace-with-strong-secret
AWS_REGION=ap-south-1
S3_BUCKET_NAME=your-bucket-name
USERS_OBJECT_KEY=users.json
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

Save and exit.

---

# 8. Create S3 Storage File

Go to:

```
AWS Console → S3 → Your Bucket
```

Create a file:

```
users.json
```

Example content:

```json
[]
```

This file stores user account data.

---

# 9. Test the Server

Run the server:

```bash
node server.js
```

Expected output:

```
Server running on http://localhost:3000
```

Open in browser:

```
http://YOUR_PUBLIC_IP:3000
```

The login page should appear.

---

# 10. Keep Server Running Using PM2

Install PM2 globally:

```bash
sudo npm install -g pm2
```

Start the server:

```bash
pm2 start server.js --name login-app
```

Verify:

```bash
pm2 list
```

Save process:

```bash
pm2 save
```

Enable auto-start on reboot:

```bash
pm2 startup
```

Run the command shown in the output.

---

# 11. Restart or Monitor Server

Restart server:

```bash
pm2 restart login-app
```

View logs:

```bash
pm2 logs
```

Stop server:

```bash
pm2 stop login-app
```

---

# 12. Access the Website

Open the website:

```
http://YOUR_PUBLIC_IP:3000
```

You can now:

* Register new users
* Login with existing accounts
* Store user data in AWS S3

---

# Application Architecture

```
Browser
   ↓
EC2 Node.js Server (Port 3000)
   ↓
AWS SDK
   ↓
AWS S3 Bucket
   ↓
users.json
```

---

# Useful Commands

Check running apps:

```bash
pm2 list
```

Restart backend:

```bash
pm2 restart login-app
```

View logs:

```bash
pm2 logs
```

Update project:

```bash
git pull
pm2 restart login-app
```

---

# Conclusion

The Login Page application is successfully deployed with:

* **Frontend:** HTML/CSS/JS
* **Backend:** Node.js + Express
* **User storage:** AWS S3 (`users.json`)
* **Process manager:** PM2
* **Hosting:** AWS EC2

This setup allows the login system to run continuously and scale easily.

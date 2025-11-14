<div align="center" width="100%">
    <img src="./public/icon.svg" width="128" alt="" />
</div>

# Uptime Kuma (with Monitor Reservation)

Uptime Kuma is an easy-to-use self-hosted monitoring tool with added monitor reservation functionality.

## 🚀 Quick Start

**Just want to run it? Copy and paste this:**

```bash
git clone https://github.com/parkerrsv/uptime-kuma-reserve.git
cd uptime-kuma-reserve
docker compose -f docker-compose-local.yml up -d
```

Then open **http://localhost:3001** in your browser. Done! 🎉

---

<img src="https://user-images.githubusercontent.com/1336778/212262296-e6205815-ad62-488c-83ec-a5b0d0689f7c.jpg" width="700" alt="" />

## 🥔 Live Demo

Try it!

Demo Server (Location: Frankfurt - Germany): <https://demo.kuma.pet/start-demo>

It is a temporary live demo, all data will be deleted after 10 minutes. Sponsored by [Uptime Kuma Sponsors](https://github.com/louislam/uptime-kuma#%EF%B8%8F-sponsors).

## ⭐ Features

**New in this fork:**
- **Monitor Reservation System** - Reserve monitors with your name and time duration
  - Quick time buttons: 1hr, 2hr, 4hr, 1 day
  - Eternal reservations (no expiration)
  - Custom date/time picker
  - **Quick Reserve** - Find and reserve the first available monitor by device type
- **Device Type Organization** - Categorize monitors with custom device types
  - User-defined device types (type your own or select from defaults)
  - Group by Device toggle button for collapsible organization
  - Suggested types: Server, Router, Switch, Workstation, Printer, IoT Device, Other
- **Visual Indicators** - Yellow background shows reserved monitors with countdown timer
  - "Eternal" badge for permanent reservations
- **Release Warnings** - Confirmation dialog warns before releasing someone else's reservation

**Original Uptime Kuma features:**
- Monitoring uptime for HTTP(s) / TCP / HTTP(s) Keyword / Ping / DNS / Docker and more
- Fancy, Reactive, Fast UI/UX
- 90+ notification services
- Multiple status pages
- Certificate info & 2FA support

## 🔧 Other Installation Methods

### Transfer existing database to this version

1. **Backup your database:**
   ```bash
   cp data/kuma.db data/kuma.db.backup
   ```

2. **Clone this repository:**
   ```bash
   git clone https://github.com/parkerrsv/uptime-kuma-reserve.git
   cd uptime-kuma-reserve
   ```

3. **Copy your old database:**
   ```bash
   cp /path/to/old/data/kuma.db ./data/
   ```

4. **Start the server:**
   ```bash
   docker compose -f docker-compose-local.yml up -d
   ```

The database migration will run automatically and add the reservation table without affecting your existing monitors.

### Standard Docker (without reservation features)

If you want the original Uptime Kuma without reservations:

```bash
docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:2
```

## 🆙 How to Update

To update this fork with the latest changes:

```bash
cd uptime-kuma-reserve
git pull
docker compose -f docker-compose-local.yml restart
```

Your database and reservations will be preserved.

## 📖 How to Use

### Setting Up Device Types

1. Click on a monitor to edit it
2. In the edit screen, find the **Device Type** field (below Friendly Name)
3. Either:
   - Select from suggested types: Server, Router, Switch, Workstation, Printer, IoT Device, Other
   - **Or type your own custom device type** and press Enter to create it
4. Save the monitor

### Grouping Monitors by Device Type

1. On the main dashboard, click the **"Group by Device"** button (next to the Select button)
2. Monitors will be organized into collapsible groups by device type
3. Click on any group header to expand/collapse that group
4. Click the button again to return to the standard list view

### Reserving a Monitor

1. Click the **"Reserve"** button on any monitor card
2. Enter your name in the dialog
3. Choose a reservation duration:
   - **Quick buttons**: 1hr, 2hr, 4hr, or 1 day
   - **Custom time**: Use the date/time picker for a specific duration
   - **Eternal**: Check the "Eternal Reservation" box for a permanent reservation
4. Click **"Reserve"** to confirm

When a monitor is reserved:
- The card background turns yellow
- Your name and a countdown timer are displayed
- Eternal reservations show an "Eternal" badge instead of a timer

### Releasing a Reservation

1. Click the **"Release"** button on a reserved monitor
2. If it's someone else's reservation, a warning dialog will appear
3. Confirm the release

### Quick Reserve

For quickly finding and reserving any available monitor of a specific type:

1. Click the **"Quick Reserve"** button (lightning bolt icon) on the main dashboard
2. Select or type a device type you're looking for
3. Enter your name
4. Choose a reservation duration (quick buttons, custom time, or eternal)
5. Click **"Quick Reserve"**
6. The system will automatically find the first unreserved monitor of that type and reserve it for you
7. If no monitors are available, you'll see an error message

## 📋 Credits

This is a fork of [Uptime Kuma](https://github.com/louislam/uptime-kuma) by Louis Lam with added monitor reservation functionality. All credit for the original project goes to Louis and the Uptime Kuma contributors.

## 🗣️ Questions?

For questions about the **reservation feature**, open an issue on this repository.

For questions about **Uptime Kuma in general**, visit the [original repository](https://github.com/louislam/uptime-kuma) or [r/UptimeKuma subreddit](https://www.reddit.com/r/UptimeKuma/).

# LeadPro

LeadPro is a modern lead management web application designed to display only the latest updated leads from Zoho CRM.  
The platform helps organizations monitor and manage incoming leads efficiently through a clean and secure dashboard interface.

---

# Overview

The core functionality of LeadPro is to fetch and display only the updated leads from Zoho CRM inside the web application.

To achieve this, a REST API integration was implemented within the source code, enabling seamless communication between the website and Zoho CRM.

The application provides:

- Real-time updated lead visibility
- Secure user-based access management
- Admin-controlled permissions
- Modern dashboard interface
- Lead detail viewing system

---

# Main Features

## Lead Synchronization

- The application fetches updated leads from Zoho CRM using REST APIs.
- Only newly updated or modified leads are displayed inside the platform.
- Users can manually sync leads using the **"Sync Leads"** button.

---

## Lead Dashboard

When the **Leads** option is clicked:

- Updated leads are displayed in card format
- Each lead contains:
  - Name
  - Company
  - Email
  - Phone
  - Product Interest
  - Date Added
- Users can click **"View Details"** to open a detailed lead information modal.

---

## Admin Access Control

LeadPro includes a dedicated **Admin Dashboard**.

The admin has supreme access over the platform and can:

- Manage users
- Control who can access the website
- View user roles
- Enable or restrict access permissions
- Refresh and monitor active users

Only admins can decide which members are allowed to access the system.

---

# Tech Stack

## Frontend
- React.js

## Backend
- Node.js
- Express.js

## CRM Integration
- Zoho CRM REST API

---

# System Workflow

```text
Zoho CRM
    ↓
REST API Integration
    ↓
Node.js + Express Backend
    ↓
React Frontend Dashboard
    ↓
Updated Leads Displayed

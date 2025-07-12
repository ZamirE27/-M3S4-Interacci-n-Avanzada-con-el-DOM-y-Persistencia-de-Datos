# Web Page Instructions

Welcome! This guide will help you understand how to use the website and navigate its features.

## What Is This Website?

This is a simple user management system built as a Single Page Application (SPA). It allows users to:
- View a list of registered users
- Create a new user
- ✏Edit existing users
- 🗑Delete users

## How to Navigate the Site

Navigation is handled through URL hash routing (`#/page-name`). Here’s how to move around:

| Page | URL Hash | What It Does |
|------|-----------|---------------|
| Home (Users List) | `#/users` | Shows all users in a table |
| Create New User | `#/post` | Opens a form to add a new user |
| Edit User | `#/edit/:id` | Opens a form to edit an existing user (replace `:id` with actual user ID) |

You can change the view either by clicking the buttons/icons or by typing the hash in the browser's address bar.

## User IDs

Every user has a unique `id` (like `1`, `2`, etc.), assigned automatically. These IDs are used:
- To identify which user to edit or delete
- In the edit route: `#/edit/1` will open the form for the user with ID 1

⚠**Do not change the ID manually unless you know what you're doing.**

## Features & How to Use Them

### View Users
- Go to `#/users`
- You'll see a table listing all users
- Each row includes buttons to edit ✏️ or delete 🗑️

### Add New User
- Go to `#/post`
- Fill out the form: Name, Email, Phone, Enroll Number, and Date of Admission
- Click **Submit** to save the new user
- Use **Cancel** to discard the form and return to the list

### ✏️ Edit Existing User
- Click the ✏️ icon next to any user or go to `#/edit/:id`
- The form will be pre-filled with that user’s info
- Change any fields and click **Submit** to update
- Use **Cancel** to return without saving

### 🗑️ Delete User
- Click the 🗑️ icon next to the user
- Confirm when prompted
- The user will be removed from the list


## Technical Notes (for developers)

- All views are loaded dynamically via the `views/` folder
- Data is fetched from a local REST API (`json-server`)
- Routes are handled using JavaScript and the `window.location.hash`

---

Feel free to explore the app and test the features!

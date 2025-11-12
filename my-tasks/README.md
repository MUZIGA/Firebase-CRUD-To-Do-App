## Firebase CRUD Task App

A protected task manager built with Next.js, TypeScript, Firebase Authentication, and Cloud Firestore. Authenticated users can create, read, update, and delete personal tasks. The dashboard is fully protected so only logged-in users can access their data.

---

## Features

- Firebase email/password authentication (register, login, logout)
- Protected dashboard that greets the signed-in user
- Firestore-backed CRUD operations with real-time updates
- Task editing, priority management, and completion toggle
- Personalized data scoping so each user only sees their tasks

---

## Tech Stack

- Next.js 16 (App Router) + TypeScript
- Firebase Authentication & Cloud Firestore (modular SDK)
- Tailwind CSS for styling

---

## Getting Started

```bash
# Clone the repository
git clone <your-repo-url>
cd my-tasks

# Install dependencies
npm install

# Run the dev server
npm run dev
```

Open `http://localhost:3000` to view the app. You’ll be redirected to the login page until authenticated.

---

## Firebase Configuration

Create a `.env.local` file in the project root and add the Firebase credentials from your console:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

These values come from your Firebase console under **Project Settings → General**.

---

## Deployment

Deploy the project to Vercel:

1. Push your code to GitHub with descriptive commits.
2. Import the repository into Vercel.
3. Configure the same Firebase environment variables in Vercel.
4. Trigger a production build and share the live URL.

Add the live deployment link to this README after publishing.

---

## Demo Credentials

Include at least one test account in Firebase Authentication with pre-seeded tasks:

- Email: `testuser@gmail.com`
- Password: `test1234`

---

## Screenshots

Add images showcasing the login and dashboard pages here for grading visibility.

---

Happy building! 🚀

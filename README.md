## Attendance Management System

A full-stack **Attendance Management System** built with:

* **Backend**: FastAPI + MongoDB
* **Frontend**: React.js with Zustand, Axios, React-Bootstrap, React-Router, Toastify, and Spinner support
* **Authentication**: Token-based with automatic expiration after 24 hours

---

## Backend (FastAPI)

### ✅ Features

* JWT-based login system
* Attendance records upload and retrieval
* Student management APIs
* CORS handling
* Static file mounting for uploaded images

### 📦 Setup

1. **Create virtual env**

```bash
python -m venv env
source env/bin/activate  # or env\Scripts\activate
```

2. **Install dependencies**

```bash
pip install -r requirements.txt
```

3. **Set environment variable**

```bash
export LOCAL_LOCATION=/absolute/path/to/upload
```

4. **Run FastAPI server**

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

---

## Frontend (React)

### ✅ Features

* Login with protected routes
* Zustand store for token management (auto-expiring in 24h)
* Fetch and display students with uploaded attendance
* Axios for API communication
* Toasts for notifications
* Spinner loading states

### 🚀 Setup

1. **Navigate to frontend**

```bash
cd web
```

2. **Install packages**

```bash
npm install
```

3. **Run frontend**

```bash
npm start
```

4. **Directory Highlights**

   * `store/authStore.js`: Handles token storage with 24-hour auto-expiry
   * `components/ProtectedRoute.js`: Wraps protected pages (e.g., Home, Dashboard)
   * `api/index.js`: Axios config
   * `pages/`: Contains `Login`, `Dashboard`, etc.

---

## 🔐 Token Expiration Logic (Zustand)

* On login, token is stored with a timestamp in `localStorage`
* Token expires and is cleared after **24 hours**
* `ProtectedRoute` ensures only authenticated users can access protected pages

---

## API Documentation
${IP}:${PORT}/docs

---

## Technologies Used

| Frontend        | Backend         | Other                 |
| --------------- | --------------- | --------------------- |
| React.js        | FastAPI         | Zustand (React store) |
| React-Bootstrap | Uvicorn         | MongoDB               |
| React Router    | Pydantic        | React-Toastify        |
| React Spinners  | CORS Middleware | Axios                 |


---

## ⚠️ Notes

* All uploaded student images are served from `/upload/` directory (mounted from server)
* Make sure to set the `LOCAL_LOCATION` environment variable to an **absolute path** where uploads are stored
* Protect all routes except login using `<ProtectedRoute>` wrapper

---

## 📫 Contact

> *Maintainer: Bhupendra Sambare*
> For suggestions or issues, please raise a GitHub issue or contact directly.

---

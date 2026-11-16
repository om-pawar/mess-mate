# MessMate — Hostel Mess & Kitchen Portal (Supabase Connected)

A modern, mobile-first web application built with **React 19**, **Tailwind CSS v4**, **Lucide Icons**, and **Supabase (`@supabase/supabase-js`)** matching the design specification pixel-for-pixel with live real-time database synchronization.

---

## 🚀 Quick Start

### 1. Database Setup (Supabase)
1. Open your Supabase project SQL Editor:
   `https://supabase.com/dashboard/project/khfuhlizabsgdpptpofv/sql/`
2. Copy and paste the contents of **[`supabase_schema.sql`](./supabase_schema.sql)**.
3. Click **Run** to generate the tables (`users`, `menus`, `meal_logs`, `announcements`, `monthly_billing`), RLS policies, and realtime publications with initial seed data.

### 2. Environment Variables (`.env`)
The project connects using:
```env
VITE_SUPABASE_URL=https://khfuhlizabsgdpptpofv.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```
*(The client automatically normalizes dashboard URLs to standard API endpoints, with seamless resilient fallbacks for offline testing).*

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🔑 Demo Login Credentials (One-Click Fill)

The login screen features two one-click quick fill pills directly below the form:

| Role | Mobile | PIN | Default View |
| :--- | :--- | :--- | :--- |
| **Demo Student** (Rohan Verma) | `9876543210` | `1234` | Student Portal (`Today Menu`) |
| **Demo Owner** (Mess Warden / Staff) | `9876500000` | `1234` | Owner Console (`Headcount`) |

---

## 🔄 Real-Time Reactive Synchronization Workflow

1. **Student Meal Toggle (`Today Menu`):**
   - Toggling Lunch or Dinner OFF calls `toggleMealNaga(studentId, mealType, false)` to persist `status: 'naga'` in `meal_logs` with `rebate_amount: 80`.
   - **Student Today Menu:** Month Savings increments from `₹320` to `₹400 credited`.
   - **Student Mess Pass:** Dinner status switches to `Skipped (Naga)`, Skips count increments to `5`, and Rebate Earned updates to `₹400`.
   - **Owner Headcount (Realtime):** Supabase Realtime detects the `meal_logs` change and decrements the Dinner expected plates (`310` → `309`) and increments Naga skips (`110` → `111`) live without refreshing!

2. **Counter Check-In Scanner (`Headcount` Tab):**
   - Click **Open Counter QR Scanner**.
   - Accepts pass code (defaults to `#MM-8849`, or choose `#MM-1120`, `#MM-2080`).
   - Calls `checkInStudentPass(qrCodeId)` to record `attended` status with timestamp in `meal_logs` and plays an audio chime confirmation.

3. **Announcements Broadcast (`Announce` Tab):**
   - Click **Send Broadcast Now** to insert into `announcements`.
   - Real-time broadcasts appear immediately in `Recent Broadcasts` and notify students via the top-right Notification Bell.

4. **Monthly Student Ledger (`Dues` Tab):**
   - Fetches live billing data from `monthly_billing` joined with `users`.
   - Filter by `All (420)`, `Overdue (34)`, or `Clear (386)`, or search by name, room, or roll number.
   - Click **Download Monthly Billing Sheet** to export a `.csv` spreadsheet.

<p align="center">
  <img src="https://img.shields.io/badge/Abdun%20Nur%20Grocery-Credit%20Management-blue?style=for-the-badge&labelColor=0f172a&color=06b6d4" alt="Project Badge" />
  <br/>
  <img src="https://img.shields.io/badge/Status-Production%20Ready-success?style=flat-square" alt="Status" />
  <img src="https://img.shields.io/badge/Version-1.0.0-blue?style=flat-square" alt="Version" />
  <img src="https://img.shields.io/badge/License-Private-red?style=flat-square" alt="License" />
  <img src="https://img.shields.io/badge/Platform-Web%20%7C%20Mobile-purple?style=flat-square" alt="Platform" />
</p>

---

# 🏪 Abdun Nur Grocery — Credit Management System

> **A private, secure, and mobile-friendly tool to track customer debts, daily purchases, and automate collections for Abdun Nur Grocery LLC, Deira, Dubai.**

---

## 🇬🇧 English

### 📋 Overview

The **Abdun Nur Grocery Credit Management System** is a purpose-built business application designed to streamline credit tracking and debt management for **Abdun Nur Grocery LLC**, located in Deira, Dubai, UAE. This system replaces manual ledger books with a modern, digital solution that ensures accuracy, professionalism, and legal preparedness.

This is a **private system** — not intended for public use or redistribution. All data is stored securely and accessible only to authorized shop personnel.

---

### ✨ Key Features

| Feature | Description |
|---------|-------------|
| 📒 **Customer Ledger** | Track item-wise details, dates, and prices for every customer. Each customer has a complete, timestamped transaction history. |
| 🧮 **Automated Calculations** | View total daily and monthly outstanding debt instantly. No more manual summing — the system calculates everything in real-time. |
| 📄 **Professional PDF Generation** | Download detailed invoices with a professional header including: **Shop Name, Phone Number, and Address**. Invoices include running totals and full transaction breakdowns. |
| ⚖️ **Legal Notice Feature** | Generate a **"Formal Notice of Default"** PDF document for police/legal complaints when a customer abandons their debt. Includes 14-day demand, police complaint warning, and Dubai Courts litigation notice. |
| 📱 **WhatsApp Automation** | Auto-generate message templates to inform customers about their daily purchases and total pending dues. Three template types: Daily Purchase, Account Summary, and Payment Reminder. |

---

### 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 19** | Frontend UI framework |
| **TypeScript** | Type-safe development |
| **Tailwind CSS 4** | Responsive, utility-first styling |
| **Vite** | Fast build tool and dev server |
| **Firebase** | Cloud database (Firestore) for real-time data sync |
| **jsPDF + AutoTable** | Professional PDF generation (invoices & legal notices) |
| **Lucide React** | Clean, modern icon library |
| **date-fns** | Date formatting and manipulation |
| **LocalStorage** | Offline-first data persistence (Firebase-ready) |

---

### 📱 Responsive Design

The system is built **mobile-first** and works seamlessly on:

- 📱 **Smartphones** — Full functionality on mobile browsers
- 📲 **Tablets** — Optimized layout for tablet screens
- 💻 **Desktops** — Full sidebar navigation and expanded views

---

### 🔄 Workflow

#### 1. Add a Customer
Navigate to **Customers → Add Customer** and enter the customer's:
- Full Name
- Phone Number (with country code, e.g., +971 50 XXX XXXX)
- Address (e.g., Al Rigga, Deira, Dubai)

#### 2. Log a Transaction
From the customer's **Ledger → New Transaction**, record:
- Transaction Date
- Item details (name, quantity, unit price)
- Optional note

The system automatically calculates item totals and the grand total.

#### 3. Generate a PDF Invoice
From any customer's **Ledger → Download Invoice**:
- Optionally filter by date range
- Preview the invoice
- Click **Download Invoice PDF** to generate a professional document

#### 4. Send a WhatsApp Message
From any customer's **Ledger → WhatsApp**:
- Choose a template type (Daily, Summary, or Reminder)
- Preview the auto-generated message
- Click **Open in WhatsApp** to send directly

#### 5. Issue a Legal Notice
From any customer's **Ledger → Legal Notice**:
- Review the debt summary
- Confirm the action
- Click **Download Legal Notice PDF** to generate a formal document

---

### ⚙️ Installation / Setup

```bash
# 1. Clone the repository
git clone https://github.com/your-username/abdun-nur-grocery-cms.git
cd abdun-nur-grocery-cms

# 2. Install dependencies
npm install

# 3. Configure Firebase (if using cloud sync)
# Create a .env file with your Firebase credentials:
# VITE_FIREBASE_API_KEY=your-api-key
# VITE_FIREBASE_AUTH_DOMAIN=your-domain
# VITE_FIREBASE_PROJECT_ID=your-project-id
# VITE_FIREBASE_STORAGE_BUCKET=your-bucket
# VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
# VITE_FIREBASE_APP_ID=your-app-id

# 4. Start the development server
npm run dev

# 5. Build for production
npm run build
```

> **Note:** The system works out-of-the-box with localStorage for offline data persistence. Firebase integration is optional and provides cloud sync and multi-device access.

---

### 📂 Project Structure

```
src/
├── App.tsx                    # Main application with navigation
├── types.ts                   # TypeScript interfaces
├── store.ts                   # Data management (localStorage / Firebase-ready)
├── pdfUtils.ts                # PDF generation utilities (Invoice & Legal Notice)
├── main.tsx                   # Application entry point
├── index.css                  # Global styles
├── components/
│   ├── Dashboard.tsx          # Overview dashboard with stats
│   ├── CustomerList.tsx       # Customer directory with search
│   ├── CustomerForm.tsx       # Add/Edit customer form
│   ├── CustomerLedger.tsx     # Individual customer transaction history
│   ├── TransactionForm.tsx    # Record new credit transactions
│   ├── InvoiceGenerator.tsx   # PDF invoice generation
│   ├── LegalNotice.tsx        # Legal notice PDF generation
│   └── WhatsAppTemplate.tsx   # WhatsApp message templates
└── public/
    └── images/                # Static assets
```

---

### 🔒 Security & Privacy

- This is a **private system** — not intended for public distribution
- All customer and transaction data is stored locally (or in your private Firebase project)
- PDF documents are generated client-side — no data is sent to external servers
- WhatsApp messages are sent through the official WhatsApp app

---

### 📞 Contact

**Abdun Nur Grocery LLC**
📍 Deira, Dubai, UAE
📞 +971 4 XXX XXXX

---

---

## 🇧🇩 বাংলা

### 📋 সারসংক্ষেপ

**আবদুন নূর গ্রোসারি ক্রেডিট ম্যানেজমেন্ট সিস্টেম** হলো দুবাইয়ের দেইরায় অবস্থিত **আবদুন নূর গ্রোসারি LLC**-এর জন্য বিশেষভাবে তৈরি একটি ব্যবসায়িক অ্যাপ্লিকেশন। এই সিস্টেমটি ম্যানুয়াল খাতা ব্যবস্থাকে প্রতিস্থাপন করে একটি আধুনিক ডিজিটাল সমাধান প্রদান করে, যা নির্ভুলতা, পেশাদারিত্ব এবং আইনি প্রস্তুতি নিশ্চিত করে।

এটি একটি **ব্যক্তিগত সিস্টেম** — জনসাধারণের ব্যবহার বা পুনর্বিতরণের জন্য নয়। সমস্ত ডেটা নিরাপদে সংরক্ষিত থাকে এবং শুধুমাত্র অনুমোদিত দোকান কর্মীদের দ্বারা অ্যাক্সেসযোগ্য।

---

### ✨ প্রধান বৈশিষ্ট্যসমূহ

| বৈশিষ্ট্য | বিবরণ |
|-----------|--------|
| 📒 **গ্রাহক খাতা (Customer Ledger)** | প্রতিটি গ্রাহকের জন্য আইটেম-ভিত্তিক বিবরণ, তারিখ এবং মূল্য ট্র্যাক করুন। প্রতিটি গ্রাহকের একটি সম্পূর্ণ, সময়-চিহ্নিত লেনদেনের ইতিহাস রয়েছে। |
| 🧮 **স্বয়ংক্রিয় হিসাব** | মোট দৈনিক এবং মাসিক বকেয়া ঋণ তাৎক্ষণিকভাবে দেখুন। আর ম্যানুয়াল যোগ করার প্রয়োজন নেই — সিস্টেমটি সবকিছু রিয়েল-টাইমে গণনা করে। |
| 📄 **পেশাদার PDF তৈরি** | বিস্তারিত ইনভয়েস ডাউনলোড করুন যাতে পেশাদার হেডার অন্তর্ভুক্ত থাকে: **দোকানের নাম, ফোন নম্বর এবং ঠিকানা**। ইনভয়েসে চলমান মোট এবং সম্পূর্ণ লেনদেনের বিবরণ অন্তর্ভুক্ত। |
| ⚖️ **আইনি নোটিশ বৈশিষ্ট্য** | যখন কোনো গ্রাহক তাদের ঋণ পরিশোধ করে না, তখন পুলিশ/আইনি অভিযোগের জন্য একটি **"আনুষ্ঠানিক খেলাপি নোটিশ"** PDF ডকুমেন্ট তৈরি করুন। এতে ১৪ দিনের দাবি, পুলিশ অভিযোগ সতর্কতা এবং দুবাই আদালতে মামলার নোটিশ অন্তর্ভুক্ত। |
| 📱 **WhatsApp স্বয়ংক্রিয়তা** | গ্রাহকদের তাদের দৈনিক ক্রয় এবং মোট বকেয়া বকেয়া সম্পর্কে জানানোর জন্য স্বয়ংক্রিয় মেসেজ টেমপ্লেট তৈরি করুন। তিন ধরনের টেমপ্লেট: দৈনিক ক্রয়, হিসাব সারসংক্ষেপ এবং পেমেন্ট রিমাইন্ডার। |

---

### 🛠️ প্রযুক্তি স্ট্যাক

| প্রযুক্তি | উদ্দেশ্য |
|-----------|---------|
| **React 19** | ফ্রন্টএন্ড UI ফ্রেমওয়ার্ক |
| **TypeScript** | টাইপ-সেফ ডেভেলপমেন্ট |
| **Tailwind CSS 4** | রেসপন্সিভ, ইউটিলিটি-ফার্স্ট স্টাইলিং |
| **Vite** | দ্রুত বিল্ড টুল এবং ডেভ সার্ভার |
| **Firebase** | রিয়েল-টাইম ডেটা সিঙ্কের জন্য ক্লাউড ডেটাবেস (Firestore) |
| **jsPDF + AutoTable** | পেশাদার PDF তৈরি (ইনভয়েস এবং আইনি নোটিশ) |
| **Lucide React** | পরিষ্কার, আধুনিক আইকন লাইব্রেরি |
| **date-fns** | তারিখ ফরম্যাটিং এবং ম্যানিপুলেশন |
| **LocalStorage** | অফলাইন-ফার্স্ট ডেটা স্থায়িত্ব (Firebase-প্রস্তুত) |

---

### 📱 রেসপন্সিভ ডিজাইন

সিস্টেমটি **মোবাইল-ফার্স্ট** হিসেবে তৈরি করা হয়েছে এবং নিম্নলিখিত ডিভাইসে নিরবচ্ছিন্নভাবে কাজ করে:

- 📱 **স্মার্টফোন** — মোবাইল ব্রাউজারে সম্পূর্ণ কার্যকারিতা
- 📲 **ট্যাবলেট** — ট্যাবলেট স্ক্রিনের জন্য অপ্টিমাইজড লেআউট
- 💻 **ডেস্কটপ** — সম্পূর্ণ সাইডবার নেভিগেশন এবং প্রসারিত ভিউ

---

### 🔄 কার্যপ্রবাহ

#### ১. গ্রাহক যোগ করুন
**গ্রাহক → নতুন গ্রাহক**-এ নেভিগেট করুন এবং গ্রাহকের নিম্নলিখিত তথ্য দিন:
- পূর্ণ নাম
- ফোন নম্বর (দেশের কোড সহ, যেমন +971 50 XXX XXXX)
- ঠিকানা (যেমন, আল রিগ্গা, দেইরা, দুবাই)

#### ২. লেনদেন লগ করুন
গ্রাহকের **খাতা → নতুন লেনদেন** থেকে রেকর্ড করুন:
- লেনদেনের তারিখ
- আইটেমের বিবরণ (নাম, পরিমাণ, একক মূল্য)
- ঐচ্ছিক নোট

সিস্টেমটি স্বয়ংক্রিয়ভাবে আইটেমের মোট এবং সর্বমোট গণনা করে।

#### ৩. PDF ইনভয়েস তৈরি করুন
যেকোনো গ্রাহকের **খাতা → ইনভয়েস ডাউনলোড** থেকে:
- ঐচ্ছিকভাবে তারিখ অনুযায়ী ফিল্টার করুন
- ইনভয়েস প্রিভিউ দেখুন
- পেশাদার ডকুমেন্ট তৈরি করতে **ইনভয়েস PDF ডাউনলোড** ক্লিক করুন

#### ৪. WhatsApp মেসেজ পাঠান
যেকোনো গ্রাহকের **খাতা → WhatsApp** থেকে:
- একটি টেমপ্লেট টাইপ নির্বাচন করুন (দৈনিক, সারসংক্ষেপ, বা রিমাইন্ডার)
- স্বয়ংক্রিয়ভাবে তৈরি মেসেজ প্রিভিউ দেখুন
- সরাসরি পাঠাতে **WhatsApp-এ খুলুন** ক্লিক করুন

#### ৫. আইনি নোটিশ জারি করুন
যেকোনো গ্রাহকের **খাতা → আইনি নোটিশ** থেকে:
- ঋণের সারসংক্ষেপ পর্যালোচনা করুন
- কাজটি নিশ্চিত করুন
- একটি আনুষ্ঠানিক ডকুমেন্ট তৈরি করতে **আইনি নোটিশ PDF ডাউনলোড** ক্লিক করুন

---

### ⚙️ ইনস্টলেশন / সেটআপ

```bash
# ১. রিপোজিটরি ক্লোন করুন
git clone https://github.com/your-username/abdun-nur-grocery-cms.git
cd abdun-nur-grocery-cms

# ২. ডিপেন্ডেন্সি ইনস্টল করুন
npm install

# ৩. Firebase কনফিগার করুন (ক্লাউড সিঙ্ক ব্যবহার করলে)
# একটি .env ফাইল তৈরি করুন আপনার Firebase প্রমাণপত্র সহ:
# VITE_FIREBASE_API_KEY=আপনার-api-key
# VITE_FIREBASE_AUTH_DOMAIN=আপনার-domain
# VITE_FIREBASE_PROJECT_ID=আপনার-project-id
# VITE_FIREBASE_STORAGE_BUCKET=আপনার-bucket
# VITE_FIREBASE_MESSAGING_SENDER_ID=আপনার-sender-id
# VITE_FIREBASE_APP_ID=আপনার-app-id

# ৪. ডেভেলপমেন্ট সার্ভার শুরু করুন
npm run dev

# ৫. প্রোডাকশনের জন্য বিল্ড করুন
npm run build
```

> **নোট:** সিস্টেমটি অফলাইন ডেটা স্থায়িত্বের জন্য localStorage দিয়ে ব্যবহারযোগ্য। Firebase ইন্টিগ্রেশন ঐচ্ছিক এবং ক্লাউড সিঙ্ক ও মাল্টি-ডিভাইস অ্যাক্সেস প্রদান করে।

---

### 📂 প্রজেক্ট স্ট্রাকচার

```
src/
├── App.tsx                    # নেভিগেশন সহ প্রধান অ্যাপ্লিকেশন
├── types.ts                   # TypeScript ইন্টারফেস
├── store.ts                   # ডেটা ম্যানেজমেন্ট (localStorage / Firebase-প্রস্তুত)
├── pdfUtils.ts                # PDF তৈরির ইউটিলিটি (ইনভয়েস ও আইনি নোটিশ)
├── main.tsx                   # অ্যাপ্লিকেশন এন্ট্রি পয়েন্ট
├── index.css                  # গ্লোবাল স্টাইল
├── components/
│   ├── Dashboard.tsx          # পরিসংখ্যান সহ ওভারভিউ ড্যাশবোর্ড
│   ├── CustomerList.tsx       # সার্চ সহ গ্রাহক ডিরেক্টরি
│   ├── CustomerForm.tsx       # গ্রাহক যোগ/সম্পাদনা ফর্ম
│   ├── CustomerLedger.tsx     # ব্যক্তিগত গ্রাহক লেনদেনের ইতিহাস
│   ├── TransactionForm.tsx    # নতুন ক্রেডিট লেনদেন রেকর্ড
│   ├── InvoiceGenerator.tsx   # PDF ইনভয়েস তৈরি
│   ├── LegalNotice.tsx        # আইনি নোটিশ PDF তৈরি
│   └── WhatsAppTemplate.tsx   # WhatsApp মেসেজ টেমপ্লেট
└── public/
    └── images/                # স্ট্যাটিক অ্যাসেট
```

---

### 🔒 নিরাপত্তা ও গোপনীয়তা

- এটি একটি **ব্যক্তিগত সিস্টেম** — জনবিতরণের জন্য নয়
- সমস্ত গ্রাহক এবং লেনদেনের ডেটা স্থানীয়ভাবে সংরক্ষিত (বা আপনার ব্যক্তিগত Firebase প্রজেক্টে)
- PDF ডকুমেন্ট ক্লায়েন্ট-সাইডে তৈরি হয় — কোনো ডেটা বাহ্যিক সার্ভারে পাঠানো হয় না
- WhatsApp মেসেজগুলো অফিসিয়াল WhatsApp অ্যাপের মাধ্যমে পাঠানো হয়

---

### 📞 যোগাযোগ

**আবদুন নূর গ্রোসারি LLC**
📍 দেইরা, দুবাই, সংযুক্ত আরব আমিরাত
📞 +971 4 XXX XXXX

---

<p align="center">
  <strong>© 2024 Abdun Nur Grocery LLC. All rights reserved.</strong>
  <br/>
  <em>This software is proprietary and confidential. Unauthorized distribution is prohibited.</em>
</p>

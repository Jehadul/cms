# Cheque Management System (CMS) - User Manual & Technical Documentation

---

**Version:** 1.0  
**Date:** February 19, 2026  
**Produced by:** Antigravity AI Assistant

---

## Table of Contents

1.  **Introduction**
2.  **System Requirements**
3.  **Installation & Setup Guide**
    *   Backend Setup (Spring Boot)
    *   Frontend Setup (React)
    *   Database Configuration
4.  **User Manual: Step-by-Step Guide**
    *   Dashboard & Quick Overview
    *   Managing Check Books
    *   Writing & Printing Cheques
    *   Incoming Cheque Management (PDCs)
    *   Approval Workflow
    *   Alerts & Notifications
    *   Reports & Inquiry Center
5.  **Technical Architecture**
6.  **Troubleshooting & Support**

---

## 1. Introduction

The **Cheque Management System (CMS)** is a comprehensive enterprise solution designed to streamline the lifecycle of financial cheques. It handles both outgoing payments (Accounts Payable) and incoming receipts (Accounts Receivable), offering robust features such as:

*   **PDC Management:** Track post-dated cheques to ensure timely clearing or depositing.
*   **Cheque Printing:** Configurable templates for printing on bank cheque leaves.
*   **Approval Workflow:** Multi-level authorization for issuing high-value cheques.
*   **Real-time Alerts:** Automated notifications for due dates, bounced cheques, and low balances.
*   **Reporting:** Detailed financial reports for reconciliation and auditing.

---

## 2. System Requirements

To run the CMS application, ensure your environment meets the following specifications:

*   **Operating System:** Windows 10/11, macOS, or Linux.
*   **Java Development Kit (JDK):** Version 17 or higher.
*   **Node.js:** Version 18.x or higher (for the frontend).
*   **Database:** PostgreSQL 14+ (or compatible SQL database).
*   **Browser:** Modern web browser (Chrome, Firefox, Edge).

---

## 3. Installation & Setup Guide

### 3.1 Backend Setup (Spring Boot)

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Configure the database connection in `src/main/resources/application.properties`:
    ```properties
    spring.datasource.url=jdbc:postgresql://localhost:5432/cheque_db
    spring.datasource.username=postgres
    spring.datasource.password=your_password
    ```
3.  Build and run the application using Maven:
    ```bash
    ./mvnw spring-boot:run
    ```
    *The backend server will start on port `8080`.*

### 3.2 Frontend Setup (React)

1.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    *The frontend application will be accessible at `http://localhost:5173`.*

---

## 4. User Manual: Step-by-Step Guide

### 4.1 Dashboard & Quick Overview
Upon logging in, you are greeted by the **Dashboard**.
*   **Key Metrics:** View total issued/received amounts and counts at a glance.
*   **Due Today:** A widget highlights cheques that need immediate action (clearing or depositing).
*   **Recent Activity:** A list of the latest 5 transactions.
*   **Quick Actions:** Shortcuts to create new cheque books, print cheques, or deposit funds.

### 4.2 Managing Cheque Books
Before issuing cheques, you must register your physical cheque books.
1.  Go to **Cheques > Cheque Books**.
2.  Click **"Add New Cheque Book"**.
3.  Select the **Bank Account** and enter the **Start Number** and **End Number**.
4.  The system automatically generates the individual cheque leaves (e.g., 1001 to 1050).
5.  Status tracking: Each leaf is tracked as *UNUSED*, *ISSUED*, *VOID*, or *CANCELLED*.

### 4.3 Writing & Printing Cheques
To issue a payment:
1.  Go to **Cheques > Issued Cheques**.
2.  Click **"New Cheque"**.
3.  Select a **Cheque Book** and an available **Leaf Number**.
4.  Enter the **Payee Name**, **Amount**, and **Cheque Date**.
5.  **Save**.
6.  To **Print**: Navigate to **Cheque Printing**, select the cheque, choose a template (e.g., "Standard SBI"), and click **Print**. Ideally, use the visual template editor to align fields to your printer.

### 4.4 Incoming Cheque Management (PDCs)
For cheques received from customers:
1.  Go to **Incoming Cheques**.
2.  Click **"New Receipt"**.
3.  Enter **Customer Name**, **Cheque Number**, **Bank Name**, and **Amount**.
4.  Set the **Cheque Date** (PDC Date).
5.  **Status Workflow**:
    *   *PENDING:* Cheque received but date is in the future.
    *   *DEPOSITED:* Sent to the bank.
    *   *CLEARED:* Funds received.
    *   *BOUNCED:* Dishonoured by the bank.

### 4.5 Approval Workflow
High-value cheques may require approval before issuance.
1.  **Requester:** Creates a cheque request. Status is *PENDING_APPROVAL*.
2.  **Approver:** Navigates to **Approvals Dashboard**.
3.  Review the request details and click **Approve** or **Reject**.
4.  Approved cheques become available for printing.

### 4.6 Alerts & Notifications
Configure automated alerts in **Alerts > Configuration**.
*   **PDC Due Today:** Get notified on the day a cheque is due.
*   **Upcoming Payments:** Set a reminder (e.g., 3 days before) to ensure funds availability.
*   **Bounced Cheques:** Immediate alert for returned cheques.
*   **Channels:** Notifications are delivered via In-App bells and Email.

### 4.7 Reports & Inquiry Center
Gain insights into your financial flow.
1.  Go to **Reports**.
2.  Select a Report Type (e.g., *Cheque Register*, *Bounced Cheques*).
3.  Filter by **Date Range**, **Status**, or **Bank**.
4.  View the data grid or **Export** to PDF/Excel for external use.

---

## 5. Technical Architecture

*   **Backend Framework:** Java Spring Boot (v3.x)
*   **Database:** PostgreSQL with Spring Data JPA (Hibernate)
*   **Security:** Spring Security with JWT (JSON Web Tokens)
*   **Task Scheduling:** Spring Scheduler (for daily alert jobs)
*   **Frontend Framework:** React.js (Vite)
*   **UI Library:** Lucide Icons, Custom CSS (Modern Dashboard Design)
*   **API Communication:** Axios (RESTful API)

---

## 6. Troubleshooting & Support

**Issue: "Database connection failed"**
*   Check if PostgreSQL service is running.
*   Verify credentials in `application.properties`.

**Issue: "Frontend build failed"**
*   Run `npm install` again to ensure all packages are downloaded.
*   Check for syntax errors in the console.

**Issue: "Alerts not sending"**
*   Ensure the `AlertScheduler` is active (check logs for "Running Alert Checks").
*   Verify Email SMTP settings if email alerts are enabled.

---
**End of Document**

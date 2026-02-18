# Cheque Management System - Implementation Plan

## Phase 1: Project Setup & Initialization
- [ ] Create project directory structure (`backend`, `frontend`)
- [ ] 1. Backend: Initialize Spring Boot project layout
- [ ] 2. Frontend: Initialize React project with Vite
- [ ] 3. Database: Configure PostgreSQL connection

## Phase 2: User & Security Module (Current Focus)
- [x] **Backend - Core Architecture**
    - [x] Create `User` entity (username, password, email, active status)
    - [x] Create `Role` entity/enum (Admin, Maker, Checker, Approver, Finance Manager)
    - [x] Create `Company` entity (for multi-company support)
    - [x] Implement `UserRepository`, `RoleRepository`, `CompanyRepository`
- [x] **Backend - Security Config**
    - [x] Configure `SecurityFilterChain`
    - [x] Implement JWT Authentication Filter
    - [x] Create `CustomUserDetailsService`
    - [x] Implement `AuthController` (login, refresh token)
- [ ] **Backend - User Management**
    - [ ] Create `UserController` (create, update, list users)
    - [ ] Implement RBAC (Role Based Access Control) logic
    - [ ] Add audit logging for login events
- [x] **Frontend - Foundation**
    - [x] Setup React Router
    - [x] Create Auth Context (for managing JWT)
    - [x] Create Private Route component
- [ ] **Frontend - UI Implementation**
    - [x] Design Login Page (modern, responsive)
    - [x] Create Dashboard Layout (Sidebar, Topbar)
    - [ ] Implement User Management Grid (for Admin)

## Phase 3: Bank & Account Management (Next Steps)
- [ ] Bank Master
- [ ] Account Master
- [ ] Cheque Book Management

## Phase 4: Cheque Processing (Maker-Checker)
- [ ] Cheque Entry Keying
- [ ] Approval Workflow

## Phase 5: Notifications & Reporting
- [ ] Email/In-app Notifications
- [ ] Reports Generation (PDF/Excel)

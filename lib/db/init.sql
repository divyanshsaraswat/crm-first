-- 1. Tenants
CREATE TABLE tenants (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50),
    password_hash VARCHAR(512) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Users
CREATE TABLE Users (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    parent_id CHAR(36),
    password_hash TEXT NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('admin', 'manager', 'user', 'guest')),
    tenant_id CHAR(36) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES Users(id),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- 3. user_settings
CREATE TABLE user_settings (
    user_id CHAR(36) PRIMARY KEY,
    notify_email BOOLEAN DEFAULT TRUE,
    notify_browser BOOLEAN DEFAULT TRUE,
    notify_lead_alerts BOOLEAN DEFAULT TRUE,
    notify_task_reminders BOOLEAN DEFAULT TRUE,
    date_format VARCHAR(20) DEFAULT 'YYYY-MM-DD',
    time_format VARCHAR(10) DEFAULT '24h',
    currency VARCHAR(10) DEFAULT 'USD',
    theme VARCHAR(20) DEFAULT 'light',
    wh_id TEXT,
    wa_token TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id) ON DELETE CASCADE
);

-- 4. Contacts
CREATE TABLE Contacts (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    first_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    account_id CHAR(36),
    contact_owner_id CHAR(36) NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_owner_id) REFERENCES Users(id)
);

-- 5. Leads
CREATE TABLE Leads (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    first_name VARCHAR(100),
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    assigned_user_id CHAR(36),
    contacts_user_id CHAR(36),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contacts_user_id) REFERENCES Contacts(id),
    FOREIGN KEY (assigned_user_id) REFERENCES Users(id)
);

-- 6. Accounts
CREATE TABLE Accounts (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(70),
    Rating VARCHAR(70),
    ContPerson VARCHAR(70),
    Address1 VARCHAR(70),
    Address2 VARCHAR(70),
    City VARCHAR(70),
    Zone VARCHAR(70),
    Zip VARCHAR(70),
    States VARCHAR(70),
    Country VARCHAR(70),
    phone VARCHAR(70),
    waphone VARCHAR(70),
    email VARCHAR(70),
    website VARCHAR(70),
    JoiningDate DATETIME,
    tenant_id CHAR(36) NOT NULL,
    SourceID CHAR(36),
    DesignationID CHAR(36),
    BusinessNature VARCHAR(70),
    FollowupID CHAR(36),
    Descriptions VARCHAR(150),
    StatusID CHAR(36),
    assigned_user_id CHAR(36) NOT NULL,
    created_by_id CHAR(36) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_user_id) REFERENCES Users(id),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- 7. Opportunities
CREATE TABLE Opportunities (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    account_id CHAR(36) NOT NULL,
    contact_id CHAR(36),
    assigned_user_id CHAR(36),
    amount DECIMAL(15,2),
    stage VARCHAR(50) NOT NULL,
    close_date DATE,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_user_id) REFERENCES Users(id),
    FOREIGN KEY (account_id) REFERENCES Accounts(id),
    FOREIGN KEY (contact_id) REFERENCES Contacts(id)
);

-- 8. Tasks
CREATE TABLE Tasks (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    subject VARCHAR(255) NOT NULL,
    body TEXT,
    status VARCHAR(50) NOT NULL,
    due_date DATE,
    contact_id CHAR(36),
    assigned_user_id CHAR(36) NOT NULL,
    created_by CHAR(36) NOT NULL,
    sender_email VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_user_id) REFERENCES Users(id),
    FOREIGN KEY (created_by) REFERENCES Users(id),
    FOREIGN KEY (contact_id) REFERENCES Contacts(id)
);

-- 9. Emails
CREATE TABLE Emails (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    subject VARCHAR(255),
    body TEXT,
    sender_email VARCHAR(255) NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    contact_id CHAR(36),
    assigned_user_id CHAR(36),
    sent_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES Contacts(id),
    FOREIGN KEY (assigned_user_id) REFERENCES Users(id)
);

-- 10. LOGS
CREATE TABLE LOGS (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    action VARCHAR(100) NOT NULL,
    userid CHAR(36) NOT NULL,
    tenant_id CHAR(36) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('admin', 'manager', 'user', 'guest')),
    created_at DATE DEFAULT CURRENT_DATE,
    FOREIGN KEY (userid) REFERENCES Users(id),
    FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- 11. notifications
CREATE TABLE notifications (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id CHAR(36),
    title TEXT,
    message TEXT,
    type VARCHAR(20) NOT NULL DEFAULT 'general',
    is_read BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- 12. Campaigns
CREATE TABLE Campaigns (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15,2)
);

-- 13. accounts_contacts
CREATE TABLE accounts_contacts (
    id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    account_id CHAR(36) NOT NULL,
    contact_id CHAR(36) NOT NULL,
    UNIQUE (account_id, contact_id),
    FOREIGN KEY (account_id) REFERENCES Accounts(id),
    FOREIGN KEY (contact_id) REFERENCES Contacts(id)
);

-- Indexes
CREATE INDEX idx_contacts_account_id ON Contacts(account_id);
CREATE INDEX idx_opportunities_account_id ON Opportunities(account_id);
CREATE INDEX idx_opportunities_contact_id ON Opportunities(contact_id);
CREATE INDEX idx_tasks_contact_id ON Tasks(contact_id);
CREATE INDEX idx_emails_contact_id ON Emails(contact_id);
CREATE INDEX idx_accounts_assigned_user_id ON Accounts(assigned_user_id);
CREATE INDEX idx_leads_assigned_user_id ON Leads(assigned_user_id);
CREATE INDEX idx_accounts_contacts_account_id ON accounts_contacts(account_id);
CREATE INDEX idx_accounts_contacts_contact_id ON accounts_contacts(contact_id);

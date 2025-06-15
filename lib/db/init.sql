IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'maindb')
BEGIN
    CREATE DATABASE maindb;
END
GO

USE maindb;
GO

-- CREATE TABLE UserRoles (
--     value VARCHAR(50) PRIMARY KEY
-- );

-- INSERT INTO UserRoles (value) VALUES ('admin'), ('manager'), ('user'), ('guest');
-- GO

CREATE TABLE Users (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    parent_id UNIQUEIDENTIFIER NULL,
    password_hash NVARCHAR(MAX) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('admin', 'manager', 'user', 'guest')) DEFAULT 'user',
    tenant_id UNIQUEIDENTIFIER NOT NULL,
    is_active BIT NOT NULL DEFAULT 1
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    
    CONSTRAINT FK_Users_Parent FOREIGN KEY (parent_id) REFERENCES Users(id),
    CONSTRAINT FK_Users_tenants FOREIGN KEY (tenant_id) REFERENCES tenants(id)
);

-- CREATE TRIGGER trg_Users_SetParentId
-- ON Users
-- AFTER INSERT
-- AS
-- BEGIN
--     UPDATE Users 
--     SET parent_id = id 
--     WHERE id IN (SELECT id FROM inserted WHERE parent_id IS NULL);
-- END;

-- CREATE TABLE FOLLOWUPMASTER(
--     id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
--     ftype nvarchar(20) NOT NULL,
-- );
-- GO

-- CREATE TABLE SOURCEMASTER(
--     id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
--     srctype nvarchar(30) NOT NULL,
-- );
-- GO
-- INSERT INTO SOURCEMASTER (srctype) 
-- VALUES 
--     ('reference'),
--     ('internet'),
--     ('trade shows'),
--     ('call');
-- GO

-- CREATE TABLE DESIGNATIONMASTER(
--     id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
--     degname nvarchar(30) NOT NULL,
-- );
-- GO

-- INSERT INTO DESIGNATIONMASTER (degname) 
-- VALUES 
--     ('partner'),
--     ('authorised person'),
--     ('Director'),
--     ('Proprietor');
-- GO
-- CREATE TABLE STATUSMASTER(
--     id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
--     statustype nvarchar(30) NOT NULL,
-- );
-- GO
-- INSERT INTO STATUSMASTER (statustype) 
-- VALUES 
--     ('OPEN'),
--     ('HOLD'),
--     ('REJECT'),
--     ('COMPLETED');
-- GO

-- CREATE TABLE ADDRESS(
--     id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
--     ContPerson nvarchar(70),
--     DesignationID int,
--     address1 nvarchar(70),
--     city nvarchar(70),
--     zip nvarchar(10),
--     states nvarchar(70),
--     country nvarchar(25),
--     phone nvarchar(70),
--     waphone nvarchar(70),
--     email nvarchar(70),
--     Customerid UNIQUEIDENTIFIER NOT NULL,
--     updated_at DATETIME2 DEFAULT GETDATE()
-- );
-- GO


-- CREATE TABLE Accounts (
--     id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
--     name nvarchar(70),
--     Rating NVARCHAR(70),
--     ContPerson NVARCHAR(70),
--     Address1 NVARCHAR(70),
--     Address2 NVARCHAR(70),
--     City NVARCHAR(70),
--     Zone NVARCHAR(70),
--     Zip NVARCHAR(70),
--     States NVARCHAR(70),
--     Country NVARCHAR(70),
--     phone NVARCHAR(70),
--     waphone NVARCHAR(70),
--     email NVARCHAR(70),
--     website NVARCHAR(70),
--     JoiningDate DATETIME2,
--     tenant_id UNIQUEIDENTIFIER NOT NULL,
--     SourceID UNIQUEIDENTIFIER,
--     DesignationID UNIQUEIDENTIFIER,
--     BusinessNature NVARCHAR(70),
--     FollowupID UNIQUEIDENTIFIER,
--     Descriptions NVARCHAR(150),
--     StatusID UNIQUEIDENTIFIER,
--     assigned_user_id UNIQUEIDENTIFIER NOT NULL,
--     created_by_id UNIQUEIDENTIFIER NOT NULL,
--     created_at DATETIME2 DEFAULT GETDATE(),
--     updated_at DATETIME2 DEFAULT GETDATE(),
--     CONSTRAINT FK_Accounts_Users FOREIGN KEY (assigned_user_id) REFERENCES Users(id)
--     CONSTRAINT FK_Customer_Source FOREIGN KEY (SourceID) REFERENCES SOURCEMASTER(id),
--     CONSTRAINT FK_Customer_Designation FOREIGN KEY (DesignationID) REFERENCES DESIGNATIONMASTER(id),
--     CONSTRAINT FK_Customer_Followup FOREIGN KEY (FollowupID) REFERENCES FOLLOWUPMASTER(id),
--     CONSTRAINT FK_Customer_Status FOREIGN KEY (StatusID) REFERENCES STATUSMASTER(id),
--     CONSTRAINT FK_Tenant_Accounts FOREIGN KEY (tenant_id) REFERENCES tenants(id)
-- );
-- GO


-- CREATE TABLE LOGS (
--     id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
--     [action] NVARCHAR(100) NOT NULL,
--     userid UNIQUEIDENTIFIER NOT NULL,
--     tenant_id UNIQUEIDENTIFIER NOT NULL,
--     role VARCHAR(50) CHECK (role IN ('admin', 'manager', 'user', 'guest')),
--     created_at date DEFAULT GETDATE(),
--     FOREIGN KEY (userid) REFERENCES users(id),
--     FOREIGN KEY (tenant_id) REFERENCES tenants(id)
-- );
-- GO
-- CREATE TABLE notifications (
--     id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
--     [user_id] UNIQUEIDENTIFIER FOREIGN KEY REFERENCES users(id),
--     title NVARCHAR(MAX),
--     message NVARCHAR(MAX),
--     [type] NVARCHAR(20) NOT NULL DEFAULT 'general',
--     is_read BIT DEFAULT 0,
--     created_at DATETIME DEFAULT GETDATE()
-- );
-- GO

-- CREATE TABLE Contacts (
--     id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
--     first_name VARCHAR(100),
--     last_name VARCHAR(100) NOT NULL,
--     email VARCHAR(255),
--     phone VARCHAR(50),
--     account_id UNIQUEIDENTIFIER NOT NULL,
--     contact_owner_id UNIQUEIDENTIFIER NOT NULL,
--     updated_at DATETIME2 DEFAULT GETDATE(),
--     CONSTRAINT FK_Contacts_Owner_Accounts FOREIGN KEY (contact_owner_id) REFERENCES Users(id)
-- );
-- GO

-- CREATE TABLE Leads (
--     id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
--     first_name VARCHAR(100),
--     last_name VARCHAR(100) NOT NULL,
--     email VARCHAR(255),
--     status VARCHAR(50) NOT NULL,
--     assigned_user_id UNIQUEIDENTIFIER,
--     contacts_user_id UNIQUEIDENTIFIER,
--     created_at DATETIME2 DEFAULT GETDATE(),
--     updated_at DATETIME2 DEFAULT GETDATE(),
--     CONSTRAINT FK_Leads_Contacts FOREIGN KEY (contacts_user_id) REFERENCES Contacts(id),
--     CONSTRAINT FK_Leads_Users FOREIGN KEY (assigned_user_id) REFERENCES Users(id)
-- );
-- GO

-- CREATE TABLE Opportunities (
--     id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
--     name VARCHAR(255) NOT NULL,
--     account_id UNIQUEIDENTIFIER NOT NULL,
--     contact_id UNIQUEIDENTIFIER,
--     assigned_user_id UNIQUEIDENTIFIER,
--     amount DECIMAL(15,2),
--     stage VARCHAR(50) NOT NULL,
--     close_date DATE,
--     updated_at DATETIME2 DEFAULT GETDATE(),
--     created_at DATETIME2 DEFAULT GETDATE(),
--     CONSTRAINT FK_Opportunities_Users FOREIGN KEY (assigned_user_id) REFERENCES Users(id),
--     CONSTRAINT FK_Opportunities_Accounts FOREIGN KEY (account_id) REFERENCES Accounts(id),
--     CONSTRAINT FK_Opportunities_Contacts FOREIGN KEY (contact_id) REFERENCES Contacts(id)
-- );
-- GO
CREATE TABLE tenants (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name NVARCHAR(255) NOT NULL,
    contact_name NVARCHAR(255) NULL,
    email NVARCHAR(255) NOT NULL UNIQUE,
    phone NVARCHAR(50) NULL,
    password_hash NVARCHAR(512) NOT NULL,
    created_at DATETIME2 DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2 DEFAULT SYSUTCDATETIME()
);
GO

CREATE TABLE user_settings (
    user_id UNIQUEIDENTIFIER PRIMARY KEY,

    -- Notification preferences
    notify_email BIT DEFAULT 1,
    notify_browser BIT DEFAULT 1,
    notify_lead_alerts BIT DEFAULT 1,
    notify_task_reminders BIT DEFAULT 1,

    -- General preferences
    date_format NVARCHAR(20) DEFAULT 'YYYY-MM-DD',
    time_format NVARCHAR(10) DEFAULT '24h',
    currency NVARCHAR(10) DEFAULT 'USD',
    theme NVARCHAR(20) DEFAULT 'light',
    wh_id NVARCHAR(MAX),
    wa_token NVARCHAR(MAX),

    created_at DATETIME2 DEFAULT SYSUTCDATETIME(),
    updated_at DATETIME2 DEFAULT SYSUTCDATETIME(),

    CONSTRAINT FK_tenant_settings_tenants FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);
GO
CREATE TABLE Tasks (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    subject VARCHAR(255) NOT NULL,
    body NVARCHAR(MAX),
    status VARCHAR(50) NOT NULL,
    due_date DATE,
    contact_id UNIQUEIDENTIFIER,
    assigned_user_id UNIQUEIDENTIFIER NOT NULL,
    created_by UNIQUEIDENTIFIER NOT NULL,
    sender_email VARCHAR(255),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Tasks_Users FOREIGN KEY (assigned_user_id) REFERENCES Users(id),
    CONSTRAINT FK_Created_By FOREIGN KEY (created_by) REFERENCES Users(id),
    CONSTRAINT FK_Tasks_Contacts FOREIGN KEY (contact_id) REFERENCES Contacts(id)
);
GO

CREATE TABLE Campaigns (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    start_date DATE,
    end_date DATE,
    budget DECIMAL(15,2)
);
GO

CREATE TABLE Emails (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    subject VARCHAR(255),
    body NVARCHAR(MAX),
    sender_email VARCHAR(255) NOT NULL,
    recipient_email VARCHAR(255) NOT NULL,
    contact_id UNIQUEIDENTIFIER,
    assigned_user_id UNIQUEIDENTIFIER,
    sent_at DATETIME2,
    created_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_Emails_Contacts FOREIGN KEY (contact_id) REFERENCES Contacts(id),
    CONSTRAINT FK_Emails_Users FOREIGN KEY (assigned_user_id) REFERENCES Users(id)
);
GO

CREATE TABLE accounts_contacts (
    id UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    account_id UNIQUEIDENTIFIER NOT NULL,
    contact_id UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT FK_AccountsContacts_Accounts FOREIGN KEY (account_id) REFERENCES Accounts(id),
    CONSTRAINT FK_AccountsContacts_Contacts FOREIGN KEY (contact_id) REFERENCES Contacts(id),
    CONSTRAINT UQ_AccountsContacts UNIQUE (account_id, contact_id)
);
GO

CREATE INDEX idx_contacts_account_id ON Contacts(account_id);
CREATE INDEX idx_opportunities_account_id ON Opportunities(account_id);
CREATE INDEX idx_opportunities_contact_id ON Opportunities(contact_id);
CREATE INDEX idx_tasks_contact_id ON Tasks(contact_id);
CREATE INDEX idx_emails_contact_id ON Emails(contact_id);
CREATE INDEX idx_accounts_assigned_user_id ON Accounts(assigned_user_id);
CREATE INDEX idx_leads_assigned_user_id ON Leads(assigned_user_id);
CREATE INDEX idx_accounts_contacts_account_id ON accounts_contacts(account_id);
CREATE INDEX idx_accounts_contacts_contact_id ON accounts_contacts(contact_id);
GO

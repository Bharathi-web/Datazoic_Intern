use SQLTraining;

--------------------------------------------CREATING SCHEMA----------------------------------------------

IF NOT EXISTS (SELECT * FROM sys.schemas WHERE name = N'FLOG')
BEGIN
EXEC('CREATE SCHEMA FLOG AUTHORIZATION SQLTraining');
END
GO

---------------------------------------------CREATING TABLES-----------------------------------------------

------------MS_ROLES TABLE----------------------
IF NOT EXISTS(SELECT * FROM SYS.TABLES WHERE NAME='ROLES' AND SCHEMA_ID=SCHEMA_ID('FLOG'))
Begin
CREATE TABLE FLOG.MS_ROLES (
role_id INT IDENTITY(1,1) PRIMARY KEY,
role_name VARCHAR(50) NOT NULL UNIQUE,
active_flag BIT DEFAULT 1,
created_at DATETIME DEFAULT GETDATE(),
modified_at DATETIME NULL
);
END
go
 
 SELECT role_id, role_name,active_flag,created_at,modified_at FROM FLOG.MS_ROLES WITH (NOLOCK);
 go


 ------------------MS_USERS TABLE-----------

IF NOT EXISTS (SELECT * FROM sys.tables WHERE NAME = 'USERS' AND schema_id = SCHEMA_ID('FLOG'))
BEGIN
CREATE TABLE FLOG.MS_USERS (
user_id INT IDENTITY(1,1) PRIMARY KEY,
role_id INT NOT NULL, -- JOIN WITH ROLES
user_name VARCHAR(100) NOT NULL,
email VARCHAR(100) NOT NULL UNIQUE,
password VARCHAR(200) NOT NULL,
active_flag BIT DEFAULT 1,
created_at DATETIME DEFAULT GETDATE(),
modified_at DATETIME NULL
);
END
GO

SELECT user_id,role_id,user_name,email,password,active_flag,created_at,modified_at from FLOG.MS_USERS WITH (NOLOCK);
go


----------------------DD_DRIVERS TABLE-------------

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name='DRIVERS' AND schema_id=SCHEMA_ID('FLOG'))
BEGIN
CREATE TABLE FLOG.DD_DRIVERS (
driver_id INT IDENTITY(1,1) PRIMARY KEY,
user_id INT NOT NULL, -- JOIN WITH USERS
license_number VARCHAR(50) NOT NULL UNIQUE,
phone VARCHAR(15),
active_flag BIT DEFAULT 1,
created_at DATETIME DEFAULT GETDATE(),
modified_at DATETIME NULL
    );
END
GO

SELECT driver_id,user_id,license_number,phone,active_flag,created_at,modified_at FROM FLOG.DD_DRIVERS WITH (NOLOCK);
go


------------------------DD_VEHICLES TABLE-------------
 
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name='VEHICLES' AND schema_id=SCHEMA_ID('FLOG'))
BEGIN
CREATE TABLE FLOG.DD_VEHICLES (
vehicle_id INT IDENTITY(1,1) PRIMARY KEY,
vehicle_number VARCHAR(50) NOT NULL UNIQUE,
type VARCHAR(50) NOT NULL,
capacity INT,
active_flag BIT DEFAULT 1,
created_at DATETIME DEFAULT GETDATE(),
modified_at DATETIME NULL
);
END
GO


SELECT vehicle_id,vehicle_number,type,capacity,active_flag,created_at,modified_at FROM FLOG.DD_VEHICLES WITH (NOLOCK);
go


-------------------------DD_CUSTOMERS TABLE--------------------
 
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name='CUSTOMERS' AND schema_id=SCHEMA_ID('FLOG'))
BEGIN
CREATE TABLE FLOG.DD_CUSTOMERS (
customer_id INT IDENTITY(1,1) PRIMARY KEY,
user_id INT NOT NULL, -- JOIN WITH USERS
phone VARCHAR(15),
address VARCHAR(255),
active_flag BIT DEFAULT 1,
created_at DATETIME DEFAULT GETDATE(),
modified_at DATETIME NULL
);
END
GO


SELECT customer_id,user_id,phone,address,active_flag,created_at,modified_at FROM FLOG.DD_CUSTOMERS WITH(NOLOCK);
go


-------------------------DD_TRIPS TABLE------------------------
 
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name='TRIPS' AND schema_id=SCHEMA_ID('FLOG'))
BEGIN
CREATE TABLE FLOG.DD_TRIPS (
trip_id INT IDENTITY(1,1) PRIMARY KEY,
customer_id INT NOT NULL, -- JOIN WITH CUSTOMERS
driver_id INT NOT NULL,   -- JOIN WITH DRIVERS
vehicle_id INT NOT NULL,  -- JOIN WITH VEHICLES
start_time DATETIME,
end_time DATETIME,
distance_km DECIMAL(10,2),
status VARCHAR(50) DEFAULT 'Scheduled',
active_flag BIT DEFAULT 1,
created_at DATETIME DEFAULT GETDATE(),
modified_at DATETIME NULL
);
END
GO

ALTER TABLE FLOG.DD_TRIPS
ADD booking_id INT ;
SELECT trip_id,customer_id,driver_id,vehicle_id,start_time,end_time,distance_km,status,active_flag,created_at,modified_at FROM FLOG.DD_TRIPS WITH (NOLOCK);

ALTER TABLE FLOG.DD_TRIPS
DROP COLUMN BOOKING_ID;


---------------------------DD_CHANGE_LOGS TABLE----------------------

 
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name='CHANGE_LOGS' AND schema_id=SCHEMA_ID('FLOG'))
BEGIN
CREATE TABLE FLOG.MS_CHANGE_LOGS (
log_id INT IDENTITY(1,1) PRIMARY KEY,
table_name VARCHAR(50),
record_id INT,
action_type VARCHAR(50), -- INSERT/UPDATE/DELETE
modified_by INT,         -- USER_ID FROM USERS
modified_at DATETIME DEFAULT GETDATE()
);
END
GO

SELECT log_id,table_name,record_id,action_type,modified_by,modified_at FROM FLOG.MS_CHANGE_LOGS WITH (NOLOCK);
go


-----------------------------DD_BOOKING TABLE---------------------------------

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name='BOOKINGS' AND schema_id=SCHEMA_ID('FLOG'))
BEGIN
CREATE TABLE FLOG.DD_BOOKINGS (
    booking_id INT IDENTITY(1,1) PRIMARY KEY,
    customer_id INT NOT NULL,
	user_id INT NOT NULL, --JOINS
    pickup_location VARCHAR(200) NOT NULL,
    drop_location VARCHAR(200) NOT NULL,
    status VARCHAR(20) DEFAULT 'Pending',
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME NULL,
);
END

SELECT booking_id,customer_id,user_id,pickup_location,drop_location,status,created_at,updated_at FROM FLOG.DD_BOOKINGS WITH (NOLOCK);


-----------------------------------DD_PAYMENTS--------------------------------------

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name='PAYMENTS' AND schema_id=SCHEMA_ID('FLOG'))
BEGIN
CREATE TABLE FLOG.DD_PAYMENTS (
payment_id INT IDENTITY(1,1) PRIMARY KEY,
trip_id INT, --JOIN WITH TRIPS 
amount_mode VARCHAR(50) CHECK (AMOUNT_MODE IN ('ONLINE','BYCASH')),
status VARCHAR(20) CHECK (STATUS IN ('PAID','UNPAID'))
);
END
GO

ALTER TABLE FLOG.DD_PAYMENTS
ADD amount INT NOT NULL;

alter table flog.dd_payments
ADD CONSTRAINT CH_PAYMENTS_MODE CHECK (PAYMENT_MODE IN ('ONLINE','BYCASH'));

SELECT * FROM FLOG.DD_PAYMENTS;

ALTER TABLE FLOG.DD_PAYMENTS
ADD created_at DATETIME NOT NULL CONSTRAINT DF_PAYMENTS_CREATEDAT DEFAULT GETDATE();

ALTER TABLE FLOG.DD_PAYMENTS
ADD modified_at DATETIME NULL;

SELECT payment_id,trip_id,status,created_at,modified_at,amount,payment_mode FROM FLOG.DD_PAYMENTS WITH (NOLOCK);
go


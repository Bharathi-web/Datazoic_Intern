use SQLTraining;


------------------------CREATING STORE PROCEDURE FOR SP_REGISTER_USERS------------


GO
 
CREATE PROCEDURE SP_REGISTER_USER
@role_id INT,
@user_name VARCHAR(100),
@email VARCHAR(100),
@password VARCHAR(200),
@created_by INT  -- ADDED BY WHOME (SUPERADMIN OR SELF)
AS
BEGIN
SET NOCOUNT ON;
 
-- 1. Check duplicate email
IF EXISTS (SELECT 1 FROM FLOG.MS_USERS WHERE email = @email AND active_flag=1)
BEGIN
PRINT 'USER ALREADY EXISTS';
RETURN;
END
 
-- 2. Insert new user
INSERT INTO FLOG.MS_USERS (role_id, user_name, email, password, active_flag, created_at) VALUES (@role_id, @user_name, @email, @password, 1, GETDATE());
 
DECLARE @new_user_id INT = SCOPE_IDENTITY();
 
-- 3. Insert into Change Logs
INSERT INTO FLOG.MS_CHANGE_LOGS (table_name, record_id, action_type, modified_by, modified_at) VALUES ('USERS', @new_user_id, 'INSERT', @created_by, GETDATE());
 
PRINT 'User registered successfully with ID = ' + CAST(@new_user_id AS VARCHAR);
END;
GO




------------------------CREATING STORE PROCEDURE FOR SP_LOGIN_USER------------

GO

CREATE PROCEDURE SP_LOGIN_USER
@email NVARCHAR(100),
@password NVARCHAR(100)
AS
BEGIN
SET NOCOUNT ON;
 
IF EXISTS (SELECT 1 FROM FLOG.MS_USERS WHERE email = @email AND password = @password AND active_flag = 1)
BEGIN
SELECT user_id, user_name, email, role_id FROM FLOG.MS_USERS WHERE email = @email AND password = @password AND active_flag = 1;
END
ELSE
BEGIN
RAISERROR('Invalid login credentials or inactive user.', 16, 1);
END
END;



 ------------------------CREATING STORE PROCEDURE FOR SP_CREATE_BOOKING------------

GO

CREATE OR ALTER PROCEDURE SP_CREATE_BOOKING
@customer_id INT,
@pickup_location VARCHAR(200),
@drop_location VARCHAR(200),
@user_id INT
AS
BEGIN
SET NOCOUNT ON;
 
DECLARE @new_booking_id INT;
 
INSERT INTO FLOG.DD_BOOKINGS (customer_id, pickup_location, drop_location, user_id, status) VALUES (@customer_id, @pickup_location, @drop_location, @user_id,'Pending');

 
SET @new_booking_id = SCOPE_IDENTITY();
 
PRINT 'Booking created successfully with ID ' + CAST(@new_booking_id AS VARCHAR);
END;
 
 
 ------------------------CREATING STORE PROCEDURE FOR SP_CREATE_BOOKING------------

GO

 CREATE OR ALTER PROCEDURE SP_CONFIRM_BOOKING
    @booking_id INT,
    @driver_id INT,
    @vehicle_id INT
    
AS
BEGIN
    SET NOCOUNT ON;
 
    -- Step 1: Update the booking status
    UPDATE FLOG.DD_BOOKINGS SET status = 'Confirmed', updated_at = GETDATE() WHERE booking_id = @booking_id;
 
    -- Step 2: Insert booking details into TRIPS
    INSERT INTO FLOG.DD_TRIPS(customer_id,driver_id,vehicle_id,start_time,status,active_flag,created_at,booking_id)
    SELECT b.customer_id,@driver_id,@vehicle_id,GETDATE(),'Confirmed',1,GETDATE(),b.booking_id
    FROM FLOG.DD_BOOKINGS b
    WHERE b.booking_id = @booking_id
      AND b.status = 'Confirmed';  -- ensure only confirmed moves to TRIPS
 
    PRINT 'Booking confirmed and Trip created!';
END;




 ------------------------CREATING STORE PROCEDURE FOR SP_MAKE_PAYEMENT------------
 
GO

 CREATE PROCEDURE SP_MAKE_PAYMENT
 @trip_id INT,
 @payment_mode NVARCHAR(50),
 @amount DECIMAL(10,2)
 AS
 BEGIN
 SET NOCOUNT ON;

 INSERT INTO FLOG.DD_PAYMENTS(trip_id,amount,status,payment_mode,created_at) VALUES  (@trip_id,@amount,'paid',@payment_mode,getdate());
 PRINT 'PAYMENT SUCCESSFULL';
 END;
 
 


 ------------------------CREATING STORE PROCEDURE FOR SP_COMPLETE_TRIP------------
 
GO


 CREATE OR ALTER PROCEDURE SP_COMPLETE_TRIP
    @trip_id INT,
    @modified_by INT,
	@distance DECIMAL(10,2)
AS
BEGIN
    SET NOCOUNT ON;
 
    -- Step 1: Update the trip record with end_time
    UPDATE FLOG.DD_TRIPS SET end_time = GETDATE(), status = 'Completed', modified_at = GETDATE(),distance_km=@distance WHERE trip_id = @trip_id
    AND active_flag = 1 AND status = 'Confirmed'; 
 
    -- Step 2: Insert into change logs for audit
    INSERT INTO FLOG.MS_CHANGE_LOGS ( table_name, record_id, action_type, modified_by, modified_at) VALUES 
	('TRIPS', @trip_id, 'UPDATE', @modified_by, GETDATE());
 
    PRINT 'Trip completed successfully!';
END;



 ------------------------CREATING STORE PROCEDURE FOR SP_LOG_CHANGES------------

GO

CREATE PROCEDURE SP_LOG_CHANGES
@table_name NVARCHAR(100),
@record_id INT,
@action_type NVARCHAR(100),
@modified_by INT

AS
BEGIN
SET NOCOUNT ON;
INSERT INTO FLOG.MS_CHANGE_LOGS (table_name, record_id, action_type, modified_by, modified_at) VALUES (@table_name,@record_id,@action_type, @modified_by, GETDATE());
END;




 ------------------------CREATING STORE PROCEDURE FOR SP_DELETE_USER------------

GO

CREATE OR ALTER PROCEDURE SP_DELETE_USER
@user_id INT,
@modified_by INT
AS
BEGIN
SET NOCOUNT ON;
 
    -- Step 1: Update user status to inactive
    UPDATE FLOG.MS_USERS SET active_flag = 0, modified_at = GETDATE() WHERE user_id = @user_id AND active_flag = 1;
 
    -- Step 2: Log this change
    INSERT INTO FLOG.MS_CHANGE_LOGS ( table_name, record_id, action_type, modified_by, modified_at)
    VALUES ('USERS', @user_id, 'DELETE', @modified_by, GETDATE());
 
    PRINT 'User deactivated successfully!';
END;

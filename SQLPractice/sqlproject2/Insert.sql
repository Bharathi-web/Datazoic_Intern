use SQLTraining;

-------------------------------------------------------INSERT INTO TABLE------------------------------------------

--INSERT INTO FLOG.MS_ROLES
INSERT INTO FLOG.MS_ROLES (Role_name) VALUES 
('SuperAdmin'),
('SupportAdmin'),
('Driver'),
('Customer');

--INSERT INTO FLOG.MS_USERS
INSERT INTO FLOG.MS_USERS (role_id,user_name,email,password) VALUES
(1,'MainAdmin','MainAdmin@fleet.com','Admin@123'),
(2,'SupportAdmin','SupportAdmin@fleet.com','SpAdmin@123'),
(3,'Driver1','Driver1@fleet.com','driver1@123'),
(4,'Custom1','Customer1@123.com','customer@123');

--INSERT INTO FLOG.DD_DRIVERS
INSERT INTO FLOG.DD_DRIVERS (user_id,license_number,phone) VALUES
(3,'TN99-3364','8438933808');


--INSERT INTO FLOG.DD_CUSTOMERS
INSERT INTO FLOG.DD_CUSTOMERS (user_id,phone,address) VALUES
(4,'7568954369','123 ST,chennai');


--INSERT INTO FLOG.DD_VEHICLES
INSERT INTO FLOG.DD_VEHICLES (vehicle_number,type,capacity) VALUES 
('TN01ABC123','LORRY',10000),
('TN02ABC456','VAN',2000),
('TNO3ABC789','BIKE',100);


--INSERT INTO FLOG.DD_BOOKINGS
INSERT INTO FLOG.DD_BOOKINGS (customer_id,user_id,pickup_location,drop_location,status) VALUES
(1,1,'Chennai','Vellore','confirmed');


--INSERT INTO FLOG.DD_TRIPS
INSERT INTO FLOG.DD_TRIPS (customer_id,driver_id,vehicle_id,start_time,status) VALUES
(1,1,1, GETDATE(),'scheduled');


--INSERT INTO FLOG.DD_PAYMENTS
INSERT INTO FLOG.DD_PAYMENTS (trip_id,status,amount,payment_mode) VALUES
(1,'paid',2500,'Online');


--INSERT INTO FLOG.MS_CHANGE_LOGS
INSERT INTO FLOG.MS_CHANGE_LOGS (TABLE_NAME,RECORD_ID,ACTION_TYPE,MODIFIED_BY) VALUES
('USERS',3,'INSERT',1),
('DRIVERS',1,'INSERT',1),
('CUSTOMERS',1,'INSERT',1);

go


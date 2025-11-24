use SQLTraining;

------------------------EXECUTING SP_REGISTER_USERS------------

EXEC SP_REGISTER_USER
@role_id=5,
@user_name='priya',
@email='priya@fleet.com',
@password='Priya123',
@created_by=1;

go

------------------------EXECUTING SP_LOGIN_USER------------

EXEC SP_LOGIN_USER
@email='priya@fleet.com',
@password='Priy3';

go

 ------------------------EXECUTING SP_CREATE_BOOKING------------

  
EXEC SP_CREATE_BOOKING
@customer_id = 4,
@pickup_location = 'Kanchipuram Bus Stand',
@drop_location = 'Chennai CMBT',
@user_id=1;

go

 ------------------------EXECUTING SP_CONFIRM_BOOKING------------

 EXEC SP_CONFIRM_BOOKING
 @booking_id=7,
 @driver_id=1,
 @vehicle_id=1;
 select * from Flog.DD_BOOKINGS;

 GO

  ------------------------EXECUTING SP_MAKE_PAYEMENT------------

   
 EXEC SP_MAKE_PAYMENT
 @trip_id=1,
 @amount=100,
 @payment_mode='BYCASH';

 GO

  ------------------------EXECUTING SP_COMPLETE_TRIP------------

 EXEC SP_COMPLETE_TRIP
 @trip_id=4,
 @modified_by =1,
 @distance=20;
 SELECT * FROM FLOG.DD_TRIPS;
 select * from Flog.ms_change_logs;

 GO

  ------------------------EXECUTING SP_LOG_CHANGES------------


EXEC SP_LOG_CHANGES
@table_name='BOOKINGS',
@record_id=8,
@action_type='INSERT',
@modified_by=1;

GO

 ------------------------EXECUTING SP_DELETE_USER------------

EXEC SP_DELETE_USER
@user_id=5,
@modified_by=1;

GO

use SQLTraining;

------------------------------------------------CONDITIONS-----------------------------------------------------------------------------------------
GO

--CHECK LOGS(WHO MODIFIED)
SELECT log_id, table_name, action_type, modified_by, modified_at FROM FLOG.MS_CHANGE_LOGS ORDER BY MODIFIED_AT DESC;


---SELECT ALL USERS WITH ROLES
SELECT u.user_id,u.user_name,u.email,r.role_name,u.active_flag FROM FLOG.MS_USERS u JOIN FLOG.MS_ROLES r ON u.role_id= r.role_id;


--SELECT TRIPS WITH CUSTOMER AND DRIVER DETAILS
SELECT t.trip_id, c.customer_id, u.user_name AS customer_name,
d.driver_id, du.user_name AS driver_name,v.vehicle_number, t.start_time, t.end_time, t.distance_km, t.status
FROM FLOG.DD_TRIPS t
JOIN FLOG.DD_CUSTOMERS c ON t.customer_id = c.customer_id
JOIN FLOG.MS_USERS u ON c.user_id = u.user_id
JOIN FLOG.DD_DRIVERS d ON t.driver_id = d.driver_id
JOIN FLOG.MS_USERS du ON d.user_id = du.user_id
JOIN FLOG.DD_VEHICLES v ON t.vehicle_id = v.vehicle_id;


-- SEARCH ALL ACTIVE DRIVERS
SELECT u.user_id, u.user_name,r.role_name FROM FLOG.MS_USERS u JOIN FLOG.MS_ROLES r ON u.role_id=r.role_id WHERE r.role_name='driver' AND u.active_flag=1;





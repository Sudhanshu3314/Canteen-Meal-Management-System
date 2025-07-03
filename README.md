# Canteen-Meal-Management-System
This project is designed to maintain a record of students who intend to have lunch or dinner at the canteen, allowing them to confirm their participation within a suitable time frame. The goal is to minimize food waste by ensuring the canteen is informed in advance. If a student fails to notify the canteen that they will not be eating, and food is prepared unnecessarily as a result, that student will be required to pay a fine.


------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

📝 Project Overview
The goal is to:

For students🧑‍🎓👨‍🎓
1) User Authentication & Registration
   👉 Allow students to register and log in using Google Authentication.
   👉 Include email verification during registration.
   👉 Provide a password reset feature via email.
   
2) Meal Attendance Submission
   👉 Allow students to mark their attendance for lunch and dinner by selecting "Yes" or "No".
   👉 Optionally, allow students to submit a reason when selecting "No".
   
3) Time Restriction for Meal Notification
   👉 Students must inform the canteen at least 4 hours prior to lunch/dinner.
   👉 If it's less than 4 hours before the meal, the system should not accept any response from students.
   
4) Food Waste Reduction
   👉 Help reduce food waste by ensuring students inform the canteen in advance if they will not be eating.

5) Fine Management (Manual + Automatic)
   👉 If students fail to notify their absence, the canteen admin has the right to fine them manually.
   👉 The system should automatically fine students who:
           ➡️Did not inform the system.
           ➡️Did not show up for lunch.
   👉This fine should be applied automatically 3 hours after lunch time.
        
6) Daily Meal Record Maintenance
   👉The system should record and maintain daily meal attendance for all students, including:
           ➡️Whether they selected Yes/No
           ➡️If they provided a reason
           ➡️Whether they were fined

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

🛠️ For Canteen Admin Settings & Features
1. Meal Time Configuration
   👉Set official Lunch and Dinner times
           ➡️Example: Lunch = 1:00 PM, Dinner = 8:00 PM
   👉Set the cut-off time for accepting meal responses (e.g., 4 hours before)

   Code :
          {
            "lunchTime": "13:00",
            "dinnerTime": "20:00",
            "mealResponseCutoff": 4 // in hours
          }

2. Fine Settings
   👉Set the fine amount for missed meals
   👉Enable/Disable automatic fine enforcement
   👉Define grace period for exceptions (e.g., health/emergency cases)
   
    Code :
        {
          "fineAmount": 50,
          "autoFineEnabled": true,
          "gracePeriodAfterMeal": 3 // in hours
        }

3. Student Meal Records Management
   👉View daily meal attendance for all students
   👉Filter by:
         ➡️Meal type (Lunch/Dinner)
         ➡️Students who responded
         ➡️Students who didn't respond
         ➡️Students who were fined
   👉Export records to CSV or PDF

4. Manual Fine Control
   👉Search a student by name/roll number
   👉Add or remove fines manually
   👉Add optional admin remarks for each fine

5. Notifications Settings
  👉Configure system to:
         ➡️Send notifications reminders to students who haven't responded after lunch or dinner and also not show up for lunch or dinner
         ➡️Send notifications to that particular fined students 

6. User Management (Admin Level)
  👉View list of all registered students
  👉Reset passwords for students if needed

7. Dashboard Overview
   👉Total students
   👉Number of absentees
   👉Total fines collected today

🔐 Admin Access Control
  👉Access sensitive data
  👉Modify fine manually for students
  👉Use admin login with role-based access control (RBAC)








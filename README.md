 Canteen-Meal-Management-System
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


Certainly! Here's a clear and complete problem statement that reflects your goal in a technically sound and structured manner, suitable for implementation or documentation:

---

 ✅ Problem Statement: Daily Student Lunch Attendance System

Develop a lunch attendance system for students, where each student must submit their lunch preference daily before a strict deadline of 9:00 AM. The lunch is scheduled daily at 1:00 PM, and the system operates on the following rules:

---

 🎯 System Requirements

1. Daily Student Input

    Each student must indicate whether they will eat lunch today ("yes" or "no").
    This input must be submitted before 9:00 AM on the same day.

2. Deadline Handling

    If a student does not submit their response before 9:00 AM, their lunch status for that day is automatically recorded as "no response".
    After 9:00 AM, students can no longer submit or update their lunch status for that day.

3. Automatic Cycle Reset

    Every day at exactly 9:00 AM, the system should:

      Lock the current day’s inputs.
      Mark unsubmitted students as "no response".
      Begin accepting inputs for the next day.
    This process must repeat daily without manual intervention.

4. Admin Dashboard

    An admin interface should be available to:

      View each student’s lunch decision ("yes", "no", or "no response") for any given day.
      Filter or search by date, student name, or email.
      Export data if needed.

5. Technical Constraints

    All timestamps and deadlines must be enforced according to the system time (IST).
    The system must be scalable and support multiple students logging in simultaneously.

---

 🛠️ Example Scenario:

 Date: July 25, 2025 (Friday)
 Student Login Time: Before 9:00 AM IST
  → Allowed to submit lunch preference.
 Student Login Time: After 9:00 AM IST
  → Cannot submit; system marks as "no response".
 At 9:00 AM on July 26, 2025, the system:

   Finalizes all July 25 responses.
   Prepares to collect submissions for July 26.

---

Let me know if you'd like this formalized into documentation or used directly in a README, backend validation logic, or admin UI component.


Absolutely! Here's the formal and complete problem statement for the Dinner Attendance System, following your exact requirements.

---

 ✅ Problem Statement: Daily Student Dinner Attendance System

Develop a dinner attendance system for students, where each student must submit their dinner preference daily before a strict deadline of 4:00 PM. The dinner is scheduled daily at 8:00 PM, and the system should operate automatically on a daily cycle.

---

 🎯 System Requirements

1. Daily Student Input

    Each student must indicate whether they will eat dinner today ("yes" or "no").
    This input must be submitted before 4:00 PM on the same day.

2. Deadline Handling

    If a student does not submit their response before 4:00 PM, their dinner status for that day is automatically recorded as "no response".
    After 4:00 PM, students can no longer submit or update their dinner status for that day.

3. Automatic Cycle Reset

    Every day at exactly 4:00 PM, the system should:

      Finalize all current day’s responses.
      Mark students who haven't submitted as "no response".
      Begin collecting input for the next day’s dinner.
    This process must repeat daily without manual intervention.

4. Admin Dashboard

    An admin interface must allow:

      Viewing each student’s dinner status ("yes", "no", or "no response") for any given date.
      Filtering and searching by date, student name, or email.
      Exporting or analyzing dinner participation data if needed.

5. Technical Constraints

    All deadlines must be enforced based on the system time (IST).
    The system must be scalable and must support concurrent submissions from many students.

---

 🛠️ Example Scenario:

 Date: July 25, 2025 (Friday)
 Dinner Time: 8:00 PM
 Student Login Time:

   Before 4:00 PM IST → Can submit their dinner status.
   After 4:00 PM IST → Cannot submit; the system marks status as "no response".
 At 4:00 PM on July 26, 2025, the system:

   Locks July 25 responses.
   Marks missing responses as `"no response"`.
   Begins collecting input for July 26 dinner.

---

 📌 Summary of Differences from Lunch System

| Feature           | Lunch              | Dinner             |
| ----------------- | ------------------ | ------------------ |
| Meal Time         | 1:00 PM            | 8:00 PM            |
| Cutoff Time       | 9:00 AM            | 4:00 PM            |
| Auto Reset Time   | 9:00 AM daily      | 4:00 PM daily      |
| Submission Window | 9:00 AM            | 4:00 PM            |

---

Let me know if you'd like both Lunch and Dinner logic:

 Combined in a single backend system,
 Split into two models and routes,
 And/or integrated into admin dashboard views.

I can also scaffold the exact code structure for dinner as we did for lunch.




MIND LIST is a tool designed to help Vietnamese students manage their time and tasks systematically, featuring an intuitive interface and powerful functionalities.


🚀 Project Setup & Usage
How to install and run your project:
✍️
npm install
npm start
🔗 Deployed Web URL or APK file
✍️ https://vibe-list-planner.vercel.app/

🎥 Demo Video
Demo video link (≤ 2 minutes):
✍️ https://youtu.be/w3-l8LHa84w


💻 Project Introduction
a. Overview
✍️ MIND LIST is a web-based task management application. It has a user-friendly, intuitive interface and powerful features aimed at helping Vietnamese students manage their time, track academic progress, and personal activities in a systematic way.
The app's main interface is divided into three areas:
-Left Navigation Bar (Sidebar): Quick access to task lists, creation functions, and support features.
-Task Display Area (User name's To Do List): The "heart" of the application, where users directly interact with their daily tasks.
-Top Toolbar (Header): Contains main tools such as the logo, navigation between views (list, calendar, analytics), the search bar and profile.

b. Key Features & Function Manual
✍️ 
1. Left Navigation Bar (Sidebar)
This is the command center of the app, which includes:
-Quick Actions: Allows users to quickly add a task (Add Task) or a new list (Add List).
-System Lists: Contains default lists that cannot be deleted or renamed, including "All," "Important," "Today," and "Completed."
-User's Lists (User name’s Lists): Where users manage their custom lists and can pin them for faster access.
-History & Recovery: Contains data management tools like "Recently Edited" and "Recently Deleted," where deleted tasks are temporarily stored for 30 days before being permanently removed.

2. Task Display Area
This area is designed to provide a comprehensive and easy-to-manage view of tasks. It features:
-Quick Add Task: An input field at the top of the area allows users to add a task title and notes, along with tools to set due dates, reminders, and priority levels.
-Quick Filter Bar: Located below the title, this bar helps users instantly filter the task list by modes like "All," "Important," "Today," and "Completed."

3. Top Toolbar (Header)
This dark blue header contains the main navigation tools and utilities:
-Main Navigation: Allows users to switch between different viewing modes.
+List: The default view, displaying all tasks in a list format.
+Calendar: Displays tasks with due dates on a calendar interface for an overview of the schedule.
+Analytics: A data visualization dashboard showing charts and statistics on work performance.
-Search Bar: Allows users to quickly find specific tasks or lists.
-Gamification Area: Displays the "Streak" (consecutive days of task completion) to motivate and encourage users to maintain the habit.
-User Profile: Quick access to personal information,settings and logout options.

c. Unique Features (What’s special about this web?)
✍️ 
- "Streak" and Gamification Feature: 🎯This "gamification" element is integrated to provide strong motivation for users. By displaying a flame 🔥 icon and the "streak" number (consecutive days of task completion), the web leverages the psychological principle of "Loss Aversion," encouraging users to return and complete at least one task each day to maintain the streak.
- Performance Analytics: 📈This dashboard doesn't just show numbers; it visualizes work performance with charts like "Completed vs. Created" and a "Productivity Heatmap." This feature helps users discover their own habits and identify their "golden hours" for work, thereby improving their time management skills.
- High Personalization: 🎨 The web allows users to customize lists with their own icons and colors, as well as automatically updating the username on the interface to create a personal workspace feel.
- Secure Data Management System: 🔒 The platform is designed with a strong focus on data security and user authentication. It features two-factor authentication (2FA) to add an extra layer of protection to user accounts, ensuring that only you can access your data. Furthermore, the system provides convenient login options by allowing users to link their accounts with external services like Facebook, Google, and GitHub. In addition to these measures, the "Recently Deleted" feature acts as a temporary trash bin, storing deleted tasks for 30 days. This gives users peace of mind, knowing they can easily restore any items they may have accidentally removed.

d. Technology Stack and Implementation Methods
✍️ Frontend:
- React 18 with TypeScript for type safety
- Vite for fast development and optimized builds
- Tailwind CSS for responsive styling
- Shadcn/UI component library
- TanStack Query for server state management
- React Router for client-side routing

Backend:
- Vercel Serverless Functions (Node.js)
- Supabase for database and real-time features
- RESTful API design with proper error handling
- CORS configuration for cross-origin requests

Development Tools:
- ESLint for code quality
- TypeScript for type checking
- Git for version control
- Vercel for deployment and hosting
e. Service Architecture & Database structure (when used)
✍️ 
Architechture
Database queries
Database tables
API endpoints

🧠 Reflection
a. If you had more time, what would you expand?
✍️ Based on the upgrade plan, if I had more time, I would focus on developing and perfecting the following features:
- AI Assistant "LiMi" Integration: 🧠 I would complete this feature so it is not just a chatbot but a smart assistant. LiMi could automatically convert task lists into logically structured documents (e.g., project plans, essay outlines), suggest related documents when users enter tasks, and even break down complex tasks into smaller, more manageable steps.
- Social Features and Gamification: 🤝 I would expand these features to create a more interactive work and study environment. This includes allowing users to react and comment directly on each task in shared lists, creating "streak" challenges for groups of friends to foster a team spirit, and implementing an "Assignment" feature to assign and track tasks effectively.
-Online Payment Integration: 💳 To realize the Freemium business model and the Mind Gems & XP currency system, I would integrate payment APIs from banks or e-wallets. This would allow users to easily purchase Mind Gems with real money, which they could then use to buy decorative items, premium features, or "freeze their streak" (protect their consecutive completion streak) if they miss a day. This system would make the application more economically sustainable while also providing additional motivation for users.

b. If you integrate AI APIs more for your app, what would you do?
✍️ If I integrated more AI APIs, I would focus on transforming MIND LIST into an intelligent personal assistant, not just a simple task management tool. Specifically, I would implement the following ideas:
- Smart Structuring (Notebook LM): I would use AI APIs to automatically analyze task items and organize them into a structured document, like a project plan or research report, based on available templates.
- Research Assistant & "Task Co-pilot": By integrating large language models like ChatGPT or Gemini, I would allow users to "chat" with the AI to brainstorm ideas, summarize content from web links, or ask the AI to automatically break down a large task into detailed sub-tasks.
- Smart Suggestions: The AI could analyze user work habits (based on data from the Analytics page) and provide personalized suggestions. For example, it could recommend "golden hours" to complete important tasks, suggest appropriate break times to avoid burnout, or automatically reschedule tasks if there are overlapping deadlines.
- Automated Reporting: The AI could automatically generate detailed weekly or monthly performance reports, highlighting the user's achievements and providing advice for improvement.

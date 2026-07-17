# Title: Presentation Demo Script - Credit Compass
* **Version**: v1.0.0
* **Purpose**: Word-for-word presenter script, screen transition cues, and timing checkpoints for the 5-minute live hackathon demo.
* **Author**: Team Credit Compass (A, B, C, D)
* **Last Updated**: 2026-07-17
* **Dependencies**: [PresentationGuide.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/PresentationGuide.md)
* **Related Documents**: [README.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/README.md), [PRD.md](file:///c:/Users/DP/Documents/Programming Languages/Credt_Compass/Credit_Compass/docs/PRD.md)

---

## Table of Contents
1. [Demo Setup & Roles Checklist](#demo-setup--roles-checklist)
2. [Word-for-Word Presenter Script](#word-for-word-presenter-script)
   - [00:00 - 00:45: The Hook (Member D)](#0000---0045-the-hook-member-d)
   - [00:45 - 01:30: Enter the Platform (Member C)](#0045---0130-enter-the-platform-member-c)
   - [01:30 - 02:45: The Conversational Advisor (Member D & Member C)](#0130---0245-the-conversational-advisor-member-d--member-c)
   - [02:45 - 04:00: Under the Hood (Member A & Member B)](#0245---0400-under-the-hood-member-a--member-b)
   - [04:00 - 05:00: Closing & Questions (Member D)](#0400---0500-closing--questions-member-d)
3. [Backup Demo Protocol](#backup-demo-protocol)
4. [Implementation Notes & Assumptions](#implementation-notes--assumptions)

---

## Demo Setup & Roles Checklist
- **Presenter Laptop**: Configured to duplicate screen, with tabs open for the deployed React frontend and the FastAPI swagger UI.
- **Pre-populated User**: Pre-register `testuser@creditcompass.com` with a standard data profile to avoid typing during the live demo.
- **Video Fallback**: Ready on desktop for instant fullscreen fallback if internet issues occur.

---

## Word-for-Word Presenter Script

### 00:00 - 00:45: The Hook (Member D)
- **Visual**: Slide 1 (Credit Compass Title & Logo).
- **Member D**: *"Hello judges. Over forty-five million Americans are currently invisible to traditional credit bureaus. They pay their rent on time, manage subscriptions, and save diligently, but traditional credit algorithms completely ignore them. Today, we are proud to introduce Credit Compass—an explainable AI-powered FinTech application that turns alternative financial signatures into a transparent credit compass, guiding underserved individuals toward secure, educational micro-investments."*
- **Action**: Transition slides to Slide 2 (The Problem).
- **Member D**: *"Traditional credit scoring is a black box. You are told your score, but rarely WHY it changed or HOW to fix it. Credit Compass solves this by using Shapley Additive Explanations, or SHAP, to demystify credit models, while establishing an educational path to investing. Let's see the application in action."*

---

### 00:45 - 01:30: Enter the Platform (Member C)
- **Action**: Switch screen focus to the active browser window displaying the Login page.
- **Member C**: *"I am now navigating to our live app interface. As you can see, we have a responsive dark theme, styled with glassmorphic cards to match the aesthetics of platforms like CRED and Stripe. Let's log in."*
- **Action**: Clicks the login button (auto-filling `demo@creditcompass.com`). The Dashboard loads.
- **Member C**: *"Upon logging in, the user sees their credit score gauge. The score is calculated using five alternative parameters. In this case, our user has an alternative score of 725. But instead of just showing a number, Credit Compass breaks down feature contributions."*
- **Action**: Hover over the positive (Green) and negative (Rose) SHAP bars.
- **Member C**: *"Here are the SHAP explanations. A high savings rate of twenty-two percent was the primary factor that increased the score. Conversely, two active debt obligations slightly reduced it. Below the charts, the system generates actionable advice: 'Reducing your subscription count by two could boost your rating.' Next, let's explore the investment advisor."*

---

### 01:30 - 02:45: The Conversational Advisor (Member D & Member C)
- **Action**: Click "Chat Advisor" in the sidebar navigation.
- **Member D**: *"Welcome to the Conversational Advisor. Many first-time investors find investment terminology intimidating. Credit Compass uses a conversational risk profiler to establish risk levels without financial jargon."*
- **Action**: Clicks through questions 1-5, selecting options that represent moderate risk.
- **Member C**: *"We are answering the final profiling question. Once submitted, the backend classifies the user as a 'Moderate Risk' investor."*
- **Action**: The interface transitions to the growth projection dashboard.
- **Member D**: *"The user is presented with a recommended asset allocation: fifty percent index ETFs, thirty percent bonds, fifteen percent growth equities, and five percent crypto. Below, Recharts plots a ten-year compounded wealth growth projection. The user can adjust these parameters live."*
- **Action**: Drags the monthly savings slider from $100 to $250. The Recharts lines update dynamically.
- **Member D**: *"Notice how the projection lines adjust. This simulator is educational, accompanied by our persistent disclaimer at the bottom of the workspace dashboard, highlighting that all data outputs are synthetic."*

---

### 02:45 - 04:00: Under the Hood (Member A & Member B)
- **Action**: Transition screen focus back to Slide 5 (Technical Architecture).
- **Member A**: *"Under the hood, our machine learning pipeline is powered by Scikit-Learn. We trained a Logistic Regression classifier on five thousand synthetic user profiles, representing various financial habits. We chose Logistic Regression because it is highly interpretable. By wrapping it in a SHAP LinearExplainer, we can compute precise individual feature contributions in under two hundred milliseconds."*
- **Member B**: *"Our backend is built on FastAPI and SQLite, using SQLAlchemy to manage data flows. Passwords are encrypted using bcrypt, and routes are protected by JWT tokens. We deployed the backend on Render and the frontend on GitHub Pages, setting up automated GitHub Actions pipelines to streamline deployments."*

---

### 04:00 - 05:00: Closing & Questions (Member D)
- **Action**: Switch screen focus to Slide 7 (Verdict & Closing).
- **Member D**: *"Credit Compass bridges the gap between alternative payment data, credit transparency, and wealth creation. By combining explainable AI and educational simulators, we help users understand their financial health and learn how to grow their savings. We are now open for questions. Thank you."*
- **Action**: Leave Slide 7 visible, showing the team's GitHub repository links.

---

## Backup Demo Protocol
- **Fallback Trigger**: If the page fails to load or the backend returns a gateway timeout error, the presenter will say:
  *"To keep things moving, let me switch to a pre-recorded walkthrough of the application."*
- **Execution**: Member C minimizes the browser window and starts the recorded backup video file, adjusting narration to match the video playback.
- **Conclusion**: Proceed to the tech architecture slide as scheduled.

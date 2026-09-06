# 🧠 Personal Gemini Journal

> **A secure, AI-powered personal journal for reflection, brainstorming, and smarter everyday thinking.**

## 📖 Overview

Personal Gemini Journal is an AI-powered web application built using Google AI Studio and Google Cloud technologies.

It combines personal journaling with the power of the Gemini API, allowing users to have meaningful multi-turn conversations, reflect on their thoughts, explore ideas, track moods, and receive personalized AI guidance.

The app also provides multiple AI conversation modes such as Journal, Fitness Coach, Business Advisor, Tech Advisor, Career Navigator, and more.

## ✨ Key Features

- 🔐 Firebase Authentication
  - Email/password authentication
  - Google Sign-In
  - Secure authenticated user sessions

- 🤖 Multi-Turn Gemini Conversations
  - Natural and context-aware AI conversations
  - Journaling, brainstorming, reflection, and guidance
  - Powered by the Gemini API

- 🧩 Multiple AI Conversation Modes
  - 📝 Journal
  - 💪 Fitness Coach
  - 💼 Business Advisor
  - 💻 Tech Advisor
  - 🎯 Career Navigator
  - And more

- 📊 Personalized Dashboard
  - Mood tracking
  - Mood trends
  - Daily reflection prompts
  - Personalized insights

- 🧠 AI Memory & Personalization
  - Save important personal preferences and memories
  - Use saved memories to provide more personalized conversations

- 💡 Discover Something About Me
  - AI-generated insights based on the user's own journal history
  - Helps users discover patterns and personal observations

- 🔀 Multi-Perspective AI Answers
  - Explore complex questions from different perspectives
  - Helps users think through decisions and ideas

- 🗂️ Chat History
  - View previous conversations
  - Delete individual conversations
  - Start new conversations

- ⭐ Saved Moments
  - Save meaningful AI responses and journal moments
  - Access saved moments later

- 📋 Journal Summaries
  - Generate summaries for different time periods
  - Save important summaries for later reference

## 🛠️ Tech Stack

- **Google AI Studio** – Application development and Gemini integration
- **Gemini API** – AI-powered conversations and insights
- **Firebase Authentication** – Secure user authentication and Google Sign-In
- **Cloud Firestore** – Persistent and user-specific data storage
- **Firestore Security Rules** – Database access control and data isolation
- **Google Cloud Secret Manager** – Secure management of sensitive API credentials
- **Google Cloud Run** – Application deployment and hosting

## 🔒 Security Highlights

Security and privacy are core parts of Personal Gemini Journal.

- 🔐 **Secure Authentication**  
  Users must authenticate before accessing their personal journal data.

- 👤 **Per-User Data Isolation**  
  User data is stored and accessed based on the authenticated user's UID.

- 🛡️ **Firestore Security Rules**  
  Firestore Security Rules restrict access to authorized user data and help prevent cross-user data access.

- 🔑 **No Hardcoded API Keys**  
  Sensitive API credentials are not hardcoded directly into the application source code.

- ☁️ **Secret Manager**  
  Sensitive secrets such as API credentials are managed securely using Google Cloud Secret Manager.

- 🚫 **Cross-User Data Protection**  
  Application logic and Firestore security rules are designed to prevent users from accessing another user's private journal data.

## 🎓 Google Cloud Gen AI Academy APAC Ideathon

This project was built for the **Google Cloud Gen AI Academy APAC Ideathon Challenge**.

The goal of the project is to demonstrate how Gemini, Firebase, and Google Cloud can be combined to create a secure, personalized, and useful generative AI application.

## 🚀 Project Goal

Personal Gemini Journal aims to make journaling more interactive and valuable by combining personal reflection with generative AI.

It helps users:

- Reflect on their thoughts
- Brainstorm ideas
- Track moods and themes
- Discover personal patterns
- Get personalized AI guidance
- Save meaningful moments and insights

while keeping personal data protected through authentication, Firestore security rules, and secure secret management.

---

**Built with ❤️ using Google AI Studio, Gemini, Firebase, and Google Cloud.**

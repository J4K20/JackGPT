# JackGPT

A ChatGPT clone site built using **Node**, **React**, and **OpenAI API**.

## 1. Project Title and Description

**JackGPT** is a real-time ChatGPT communication application. It replicates the core function of ChatGPT, allowing users to interact with the OpenAI API using a more modern and customizable user interface.

## 2. Problem Domain

OpenAI only offers one default user interface which may not fit every user's preferences or workflow. JackGPT aims to redesign the ChatGPT UI to make it more user-friendly, more customizable, and less cluttered; focusing on only showing UI elements the user will actually use.

## 3. Features and Requirements

### Features
 - **Sprint 1:**
    - Real-time ChatGPT communication through OpenAI API
    - Multiple conversations and viewable conversation history, stored locally

 - **Sprint 2:**
    - User-customizable UI through enabling/disabling UI elements made with React
    - Ability to export and import conversations
    - Light and dark mode UI's

### Requirements

 - **Functional**: Users must be able to have conversations with ChatGPT, manage multiple conversations, and have a persistent chat history.
 - **Non-Functional**: The application should have a customizable interface, two built-in themes, and the ability to import and export conversations.

## 4. Data Model and Architecture

### Data Model
 - **Frontend**: React-based UI that receives user input and display AI responses
 - **Backend**: Node.js Express server that communicates between the client and OpenAI API
 - **Storage**: Conversations will be stored locally using localStorage

### Architecture
 - **Session**: Stores user preferences
 - **Conversation**: Contains a unique ID, name, and list of messages
 - **Message**: Contains sender and message content

## 5. Tests

 - **Manual Testing**: Code will be manually tested as it is written
 - **Unit Testing**: Unit tests will be performed using Jest
 - **Integration Tests**: Integration tests will be performed using Supertest
 - **E2E Tests**: End to end tests will be performed using Playwright

## 6. Team Members and Roles

Project by **Jack Dixon**

## 7. Links

 - **Code Repository**: [Github Repo](https://github.com/J4K20/JackGPT)
 - **Documentation**: [Docs Folder](./docs)
 - **Presentation**: [PPP Presentation](./docs/presentation/ppp_individual.md)

````markdown
# React Native App Development Plan

## Overview

Build a React Native app with Firebase authentication, a form for multi-media input, S3 uploads, Firestore integration, and a dashboard with data visualization. Uses Tailwind for styling and modern animations.

---

## 1. Project Setup & Dependencies

- **Initialize React Native Project**: Use `npx react-native init` with TypeScript template.
- **Install Core Dependencies**:
  - Firebase: `@react-native-firebase/app`, `auth`, `firestore`
  - AWS SDK: `aws-amplify`, `@aws-sdk/client-s3`
  - File Handling: `react-native-image-picker`, `react-native-audio-record`, `react-native-document-picker`
  - UI/Animations: `react-native-reanimated`, `nativewind` (Tailwind), `lottie-react-native`
  - Navigation: `@react-navigation/native`, `@react-navigation/stack`
  - Charts: `react-native-chart-kit`
  - State Management: `react-hook-form` (form handling), `zustand` (global state)

---

## 2. Firebase Configuration

### A. Authentication Setup

1. Enable Email/Password & Google auth in Firebase Console.
2. Implement screens:
   - Login
   - Signup
   - Password Reset
3. Integrate Firebase Auth SDK:
   ```tsx
   import auth from '@react-native-firebase/auth';
   // Handle login/signup with error boundaries
   ```
````

### B. Firestore Database

1. Create `submissions` collection structure:
   ```ts
   interface Submission {
     userId: string;
     text: string;
     images: string[]; // S3 URLs
     audio: string;
     srt: string;
     createdAt: firestore.Timestamp;
   }
   ```
2. Set security rules:
   ```firestore
   match /submissions/{doc} {
     allow read, write: if request.auth.uid == resource.data.userId;
   }
   ```

---

## 3. AWS S3 Integration

1. Create S3 bucket with **authenticated users** write access.
2. Generate IAM policies for limited PutObject access.
3. Implement upload service:
   ```ts
   const uploadToS3 = async (
     uri: string,
     fileType: 'image' | 'audio' | 'srt'
   ) => {
     const key = `${user.uid}/${Date.now()}.${fileType}`;
     await S3.putObject({ Bucket: 'my-bucket', Key: key, Body: file });
     return `https://s3.region.amazonaws.com/my-bucket/${key}`;
   };
   ```

---

## 4. Core Features Implementation

### A. Authentication Flow

- Protected routes using navigation guards
- Handle auth state persistence
- Error handling for invalid credentials

### B. Main Form Screen

![Form UI Concept](https://example.com/form-wireframe.jpg)

1. **UI Components**:

   - Drag-and-drop image upload (max 5 images)
   - Audio recorder with waveform visualization
   - SRT file picker with preview
   - Rich text editor with markdown support
   - Animated submit button (Lottie)

2. **State Management**:

   - Use `react-hook-form` for form validation
   - Track upload progress with Zustand store

3. **Submission Logic**:
   ```ts
   const onSubmit = async (data) => {
     const urls = await Promise.all([
       ...data.images.map((img) => uploadToS3(img, 'image')),
       uploadToS3(data.audio, 'audio'),
       uploadToS3(data.srt, 'srt'),
     ]);

     await firestore()
       .collection('submissions')
       .add({
         ...data,
         urls,
         userId: auth().currentUser?.uid,
       });
   };
   ```

### C. Dashboard Screen

1. **Data Visualization**:

   - Pie chart showing file type distribution
   - Timeline of submissions using `react-native-chart-kit`
   - Recent activity feed

2. **UI Elements**:
   - Floating action button for new submissions
   - Swipe-to-refresh functionality
   - Filterable data table

---

## 5. Styling & Animations

1. **Tailwind Configuration**:

   - Extend `tailwind.config.js` with custom colors and spacing
   - Create reusable components (Card, PrimaryButton, InputField)

2. **Key Animations**:
   - Form input transitions with `react-native-reanimated`
   - Loading spinner during uploads
   - Success/failure toast notifications

---

## 6. Testing Plan

1. **Unit Tests**:

   - Form validation logic
   - Firebase security rules
   - S3 upload service

2. **E2E Tests**:
   - Authentication flow with Detox
   - File upload scenarios
   - Dashboard data rendering

---

## 7. Deployment Strategy

1. **App Distribution**:

   - Android: .aab via Play Store
   - iOS: TestFlight deployment

2. **Infrastructure**:
   - Firebase Project setup for production
   - S3 bucket versioning & lifecycle policies
   - CloudFront CDN for static assets

---

## 8. Timeline & Milestones

| Phase         | Duration | Deliverables                    |
| ------------- | -------- | ------------------------------- |
| Setup         | 3 days   | Project boilerplate, auth flow  |
| Core Features | 10 days  | Form, S3 upload, Firestore sync |
| Dashboard     | 5 days   | Charts, data tables, filters    |
| Polishing     | 4 days   | Animations, edge case handling  |
| Testing       | 3 days   | E2E tests, performance tweaks   |

---

## Required Collaborations

1. **Backend Engineer**: S3 policy configuration
2. **DevOps**: CI/CD pipeline setup
3. **QA Engineer**: Test case development

Let me know if you need clarification on any component! 🚀

```

This plan provides technical depth while maintaining readability. Senior engineers can immediately start implementation with the provided code snippets and architecture guidance.
```

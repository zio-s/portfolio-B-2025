# Admin Dashboard - Testing Checklist

## Overview
This document provides a comprehensive testing checklist for the Admin Dashboard functionality (Phase 6) that has been implemented.

## Test Environment
- **Dev Server**: http://localhost:5174
- **Admin User**: admin@test.com / password: test1234
- **Regular User**: user@test.com / password: test1234

---

## 1. Authentication & Access Control

### Test Cases:

#### ✅ Admin Login
1. Navigate to http://localhost:5174/login
2. Login with admin credentials (admin@test.com / test1234)
3. **Expected**: Redirect to dashboard with admin sections visible
4. **Verify**: Stats section and Quick Actions are displayed

#### ✅ Non-Admin Access Prevention
1. Login with regular user (user@test.com / test1234)
2. Try to access `/admin/projects` directly
3. **Expected**: Redirect to `/403` (Forbidden page)
4. **Verify**: 403 page displays with proper messaging

#### ✅ Unauthenticated Access Prevention
1. Logout (if logged in)
2. Try to access `/admin/projects` or `/admin/comments`
3. **Expected**: Redirect to `/login` page
4. **Verify**: Login form is displayed

---

## 2. Admin Dashboard Page

### Test Cases:

#### ✅ Stats Display (Admin Only)
1. Login as admin
2. Navigate to Dashboard (`/dashboard`)
3. **Expected**: 4 stat cards displayed with:
   - Total Projects (📁)
   - Total Comments (💬)
   - Total Views (👁️)
   - Total Likes (❤️)
4. **Verify**:
   - All stats show correct numbers
   - Cards are clickable (hover effects work)
   - Clicking Projects/Comments cards navigates to respective pages

#### ✅ Quick Actions Section
1. On Dashboard, find "⚡ Quick Actions" section
2. **Expected**: 3 action buttons:
   - 프로젝트 관리 (Projects Management)
   - 댓글 관리 (Comments Management)
   - 공개 페이지 보기 (Public Page View)
3. **Verify**:
   - Each button has hover effect (lift animation)
   - Clicking each button navigates to correct page

#### ✅ Regular User Cards
1. Below admin sections, find regular user cards
2. **Expected**:
   - 게시글 (Posts)
   - 새 게시글 (New Post)
   - 프로필 (Profile)
   - 사용자 (Users) - admin only
3. **Verify**: All cards are functional

---

## 3. Admin Projects Management

### Test Cases:

#### ✅ Projects List Display
1. Navigate to `/admin/projects`
2. **Expected**:
   - Table displaying all projects
   - Columns: Title, Category, Featured, Views, Likes, Comments, Actions
   - Total count at bottom
3. **Verify**:
   - All 5 mock projects are displayed
   - Data is correctly formatted
   - Stats are accurate

#### ✅ Create New Project
1. Click "+ 새 프로젝트" button
2. **Expected**: Modal form opens with empty fields
3. Fill in all required fields:
   - 제목: "Test Project"
   - 설명: "Test description"
   - 내용: "# Test Content\n\nSome markdown content"
   - 썸네일 URL: "https://images.unsplash.com/photo-1234567890"
   - 기술 스택: "React, TypeScript, Vite"
   - 카테고리: Select "web"
   - 태그: "test, new"
   - Featured: Check the checkbox
4. Click "생성하기"
5. **Expected**:
   - Alert: "프로젝트가 생성되었습니다."
   - Modal closes
   - Project list refreshes
   - New project appears in table
6. **Verify**:
   - Featured toggle shows "⭐ YES"
   - All data is correctly displayed

#### ✅ Edit Existing Project
1. Find a project in the table
2. Click "✏️" (Edit) button
3. **Expected**: Modal form opens with project data pre-filled
4. Modify some fields (e.g., change title, add more tech stack)
5. Click "수정하기"
6. **Expected**:
   - Alert: "프로젝트가 수정되었습니다."
   - Modal closes
   - Table refreshes with updated data
7. **Verify**: Changes are reflected in table

#### ✅ Featured Toggle
1. Find a project with Featured = "NO"
2. Click the "NO" button
3. **Expected**:
   - Button changes to "⭐ YES" with gradient background
   - Table refreshes
4. Click "⭐ YES" button again
5. **Expected**: Button changes back to "NO" with gray background
6. **Verify**: Toggle works both ways without errors

#### ✅ Delete Project
1. Find a project to delete
2. Click "🗑️" (Delete) button
3. **Expected**: Confirm dialog: "\"[Title]\"을(를) 삭제하시겠습니까?"
4. Click "취소" (Cancel)
5. **Expected**: Nothing happens, dialog closes
6. Click "🗑️" again, then click "확인" (OK)
7. **Expected**:
   - Alert: "삭제되었습니다."
   - Table refreshes
   - Project is removed from list
   - Total count decrements
8. **Verify**: Deleted project no longer appears

#### ✅ Form Validation
1. Click "+ 새 프로젝트"
2. Leave required fields empty
3. Click "생성하기"
4. **Expected**:
   - Red border on empty required fields
   - Error messages below fields:
     - "제목을 입력해주세요"
     - "설명을 입력해주세요"
     - "내용을 입력해주세요"
     - "썸네일 URL을 입력해주세요"
     - "기술 스택을 입력해주세요"
5. **Verify**: Form does not submit until all required fields are filled

#### ✅ Form Cancel
1. Click "+ 새 프로젝트"
2. Fill in some fields
3. Click "취소" button
4. **Expected**: Modal closes without saving
5. Click "+ 새 프로젝트" again
6. **Expected**: Form is empty (previous data not retained)

---

## 4. Admin Comments Management

### Test Cases:

#### ✅ Comments List Display
1. Navigate to `/admin/comments`
2. **Expected**:
   - Table displaying all comments
   - Columns: Project, Author, Content, Likes, Date, Actions
   - Total count at bottom
3. **Verify**:
   - All mock comments are displayed
   - Author avatars are shown
   - Reply indicator (↳ 답글) appears for nested comments
   - Dates are formatted in Korean locale

#### ✅ Delete Comment (Single)
1. Find a comment WITHOUT replies (check mock data)
2. Click "🗑️" button
3. **Expected**: Confirm dialog with content preview (truncated to 30 chars)
4. Click "확인" (OK)
5. **Expected**:
   - Alert: "삭제되었습니다."
   - Table refreshes
   - Comment is removed
6. **Verify**: Only that comment is deleted

#### ✅ Delete Comment (Cascade)
1. Find a comment WITH replies (parent comment)
2. Note the number of replies
3. Click "🗑️" button
4. Click "확인" (OK)
5. **Expected**:
   - Alert: "삭제되었습니다."
   - Parent comment AND all replies are deleted
   - Total count decrements by (1 + number of replies)
6. **Verify**: All descendant comments are removed

#### ✅ Project Stats Update on Comment Delete
1. Note the comment count for a project in mock data
2. Navigate to `/admin/comments`
3. Delete a comment belonging to that project
4. Navigate to `/admin/projects`
5. **Expected**: Project's comment count has decreased
6. **Verify**: Stats are synchronized correctly

---

## 5. MSW Mock API Endpoints

### Endpoints to Verify:

#### ✅ Admin Stats
- **Endpoint**: `GET /api/admin/stats`
- **Expected Response**:
```json
{
  "success": true,
  "data": {
    "totalProjects": 5,
    "totalComments": 12,
    "totalViews": 3592,
    "totalLikes": 263
  }
}
```

#### ✅ Get All Projects
- **Endpoint**: `GET /api/admin/projects`
- **Expected**: Array of 5 projects with stats

#### ✅ Create Project
- **Endpoint**: `POST /api/admin/projects`
- **Request**: Project data (see form fields)
- **Expected**: Success response with new project (auto-generated ID, timestamps, stats)

#### ✅ Update Project
- **Endpoint**: `PUT /api/admin/projects/:id`
- **Request**: Partial project data
- **Expected**: Success response with updated project (updatedAt timestamp changed)

#### ✅ Delete Project
- **Endpoint**: `DELETE /api/admin/projects/:id`
- **Expected**: Success response, project removed from array

#### ✅ Toggle Featured
- **Endpoint**: `PATCH /api/admin/projects/:id/featured`
- **Request**: `{ "featured": true/false }`
- **Expected**: Success response, featured status updated

#### ✅ Get All Comments
- **Endpoint**: `GET /api/admin/comments`
- **Expected**: Array of all comments across all projects

#### ✅ Delete Comment
- **Endpoint**: `DELETE /api/admin/comments/:id`
- **Expected**:
  - Success response
  - Comment + descendants deleted
  - Project stats updated

---

## 6. Data Persistence (Expected Behavior)

### ✅ Session Behavior
1. Create a new project
2. Refresh the page (F5)
3. **Expected**: New project is GONE
4. **Reason**: MSW stores data in-memory (JavaScript arrays)
5. **This is CORRECT behavior** for development without backend

### ✅ Cross-Session Behavior
1. Login as admin
2. Create a project
3. Logout
4. Login again
5. **Expected**: Created project is gone
6. **This is CORRECT** - data resets when page reloads

**Note**: 사용자가 MongoDB나 Firebase를 연결하기 전까지는 데이터가 새로고침 시 사라지는 것이 정상 동작입니다.

---

## 7. UI/UX Testing

### ✅ Responsive Design
1. Resize browser window
2. Test breakpoints: Desktop (1400px), Tablet (768px), Mobile (375px)
3. **Verify**:
   - Tables scroll horizontally on small screens
   - Cards reflow in grid layouts
   - Modal form is readable on mobile

### ✅ Loading States
1. Watch for "Loading..." states when fetching data
2. Watch for "저장 중..." on form submission
3. **Verify**: Loading indicators appear before data loads

### ✅ Error States
1. Open browser DevTools → Network tab
2. Simulate network failure (offline mode)
3. Try to fetch projects
4. **Expected**: Error message displays
5. **Verify**: Error handling works gracefully

### ✅ Hover Effects
1. Hover over stat cards
2. Hover over quick action buttons
3. Hover over table action buttons
4. **Verify**:
   - Smooth transitions
   - Visual feedback (lift, shadow, color change)
   - No janky animations

---

## 8. Browser Console Checks

### ✅ No Errors
1. Open DevTools → Console
2. Perform all CRUD operations
3. **Expected**: No error messages (red text)
4. **Allowed**:
   - MSW logs (blue/gray text): "🎭 [MSW] GET /api/admin/stats"
   - Info logs about Service Worker

### ✅ No Warning Messages
1. Check console for warnings (yellow text)
2. **Expected**: No React warnings about:
   - Missing keys in lists
   - Invalid prop types
   - Memory leaks
   - Deprecated APIs

---

## 9. TypeScript Compilation

### ✅ No Type Errors
1. Terminal: Check Vite dev server output
2. **Expected**: "ready in XXX ms" with no type errors
3. If you run `npm run build`:
   - **Expected**: Build succeeds without errors
   - Output: `dist/` folder created

---

## 10. Cross-Feature Integration

### ✅ Dashboard → Projects Flow
1. Dashboard → Click "Total Projects" card
2. **Expected**: Navigate to `/admin/projects`
3. **Verify**: Smooth navigation without page reload (React Router)

### ✅ Dashboard → Comments Flow
1. Dashboard → Click "Total Comments" card
2. **Expected**: Navigate to `/admin/comments`

### ✅ Quick Actions Navigation
1. Dashboard → Click "프로젝트 관리"
2. **Expected**: Navigate to `/admin/projects`
3. Back button → Dashboard
4. Click "댓글 관리"
5. **Expected**: Navigate to `/admin/comments`
6. Back button → Dashboard
7. Click "공개 페이지 보기"
8. **Expected**: Navigate to `/projects` (public portfolio page)

---

## Summary Checklist

### Core Functionality
- [ ] Admin authentication works
- [ ] Non-admin users blocked from admin pages
- [ ] Dashboard displays stats correctly
- [ ] Stats cards are clickable and navigate correctly
- [ ] Quick Actions buttons work

### Projects Management
- [ ] Projects table displays all data
- [ ] Create new project works
- [ ] Edit existing project works
- [ ] Delete project works
- [ ] Featured toggle works
- [ ] Form validation works
- [ ] Form cancel works

### Comments Management
- [ ] Comments table displays all data
- [ ] Delete single comment works
- [ ] Delete with cascade (parent + replies) works
- [ ] Project stats update after comment deletion

### Quality
- [ ] No console errors
- [ ] No TypeScript compilation errors
- [ ] Responsive design works on mobile/tablet
- [ ] Loading states appear appropriately
- [ ] Hover effects work smoothly

### Known Limitations (NOT Bugs)
- Data disappears on page refresh (expected with MSW mock)
- No backend persistence (to be added later with MongoDB/Firebase)
- Images are external URLs (Unsplash placeholders)

---

## Next Steps (Future)

After all tests pass, the remaining work for production deployment:

1. **Backend Integration**:
   - Connect MongoDB or Firebase
   - Replace MSW handlers with real API calls
   - Implement data persistence
   - Add authentication backend (JWT)

2. **Image Upload**:
   - Replace URL input with file upload
   - Integrate with Cloudinary/S3
   - Add image compression

3. **Rich Text Editor**:
   - Replace textarea with markdown editor
   - Add preview mode
   - Syntax highlighting

4. **Advanced Features**:
   - Drag & drop for project ordering
   - Bulk operations (multi-select delete)
   - Export/import functionality
   - Activity logs/audit trail

---

## Bug Reporting Template

If you find bugs, report them with:

```
**Bug Title**: [Clear, concise title]

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior**: [What should happen]

**Actual Behavior**: [What actually happened]

**Screenshots**: [If applicable]

**Console Errors**: [Any errors in browser console]

**Environment**:
- Browser: [Chrome/Firefox/Safari]
- Browser Version: [e.g., Chrome 120.0]
- OS: [Windows/Mac/Linux]
```

---

## Testing Complete ✅

Once all checkboxes are marked, the Admin Dashboard implementation is complete and ready for backend integration!

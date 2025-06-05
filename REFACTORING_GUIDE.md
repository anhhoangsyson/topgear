# Refactoring Guide - Best Practices

## 🎯 Mục tiêu Refactoring
1. **Code readability**: Code dễ đọc, dễ hiểu
2. **Maintainability**: Code dễ maintain và extend
3. **Performance**: Tối ưu performance
4. **Security**: Đảm bảo security best practices
5. **Testing**: Code dễ test

---

## 📋 Refactoring Strategies

### 1. Extract Method/Function
**Khi nào áp dụng**: Function quá dài (>20 lines) hoặc logic phức tạp

**Trước:**
```typescript
function processUser(user: any) {
  // Validate user
  if (!user.email || !user.name) {
    throw new Error('Invalid user');
  }
  
  // Format user data
  const formattedUser = {
    email: user.email.toLowerCase(),
    name: user.name.trim(),
    createdAt: new Date()
  };
  
  // Save to database
  return database.save(formattedUser);
}
```

**Sau:**
```typescript
function processUser(user: User): Promise<User> {
  validateUser(user);
  const formattedUser = formatUserData(user);
  return saveUser(formattedUser);
}

function validateUser(user: User): void {
  if (!user.email || !user.name) {
    throw new Error('Invalid user data');
  }
}

function formatUserData(user: User): FormattedUser {
  return {
    email: user.email.toLowerCase(),
    name: user.name.trim(),
    createdAt: new Date()
  };
}
```

### 2. Extract Custom Hook
**Khi nào áp dụng**: Logic tái sử dụng được giữa các component

**Trước:**
```typescript
function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    fetchUser()
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  
  // Component logic...
}
```

**Sau:**
```typescript
function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    setLoading(true);
    fetchUser()
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  
  return { user, loading, error };
}

function UserProfile() {
  const { user, loading, error } = useUser();
  // Component logic...
}
```

### 3. Component Composition
**Khi nào áp dụng**: Component quá lớn hoặc có nhiều responsibility

**Trước:**
```typescript
function UserDashboard() {
  return (
    <div>
      {/* Header */}
      <header>
        <h1>Dashboard</h1>
        <nav>...</nav>
      </header>
      
      {/* Main content */}
      <main>
        <section>Profile Info</section>
        <section>Recent Activities</section>
        <section>Statistics</section>
      </main>
      
      {/* Footer */}
      <footer>...</footer>
    </div>
  );
}
```

**Sau:**
```typescript
function UserDashboard() {
  return (
    <div>
      <DashboardHeader />
      <DashboardMain />
      <DashboardFooter />
    </div>
  );
}

function DashboardMain() {
  return (
    <main>
      <ProfileSection />
      <ActivitiesSection />
      <StatisticsSection />
    </main>
  );
}
```

---

## 🔧 Common Refactoring Patterns

### 1. Replace Magic Numbers/Strings
```typescript
// Trước
if (user.status === 1) {
  // logic
}

// Sau
const USER_STATUS = {
  ACTIVE: 1,
  INACTIVE: 0,
  PENDING: 2
} as const;

if (user.status === USER_STATUS.ACTIVE) {
  // logic
}
```

### 2. Use Proper Error Handling
```typescript
// Trước
async function fetchData() {
  const response = await fetch('/api/data');
  return response.json();
}

// Sau
async function fetchData(): Promise<ApiResponse<Data>> {
  try {
    const response = await fetch('/api/data');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw new ApiError('Failed to fetch data', error);
  }
}
```

### 3. Implement Proper Type Safety
```typescript
// Trước
function processItems(items: any[]) {
  return items.map(item => item.name);
}

// Sau
interface Item {
  id: string;
  name: string;
  category: string;
}

function processItems(items: Item[]): string[] {
  return items.map(item => item.name);
}
```

---

## 📊 Refactoring Checklist

### Before Refactoring
- [ ] Understand the current code completely
- [ ] Identify the specific problem to solve
- [ ] Have tests in place (or write them)
- [ ] Create a backup/branch

### During Refactoring
- [ ] Keep changes small and incremental
- [ ] Test after each change
- [ ] Maintain existing functionality
- [ ] Update documentation as needed

### After Refactoring
- [ ] All tests pass
- [ ] Code review completed
- [ ] Performance is maintained or improved
- [ ] Documentation updated

---

## 🎯 Refactoring Priorities

### High Priority
1. **Security vulnerabilities**
2. **Performance bottlenecks**
3. **Code that causes frequent bugs**
4. **Code that's hard to understand**

### Medium Priority
1. **Duplicate code**
2. **Long functions/methods**
3. **Large classes/components**
4. **Poor naming**

### Low Priority
1. **Minor style inconsistencies**
2. **Minor performance optimizations**
3. **Code comments improvement**

---

## 📝 Documentation Template

### Refactoring Record
```markdown
## Refactoring: [Component/Function Name]
**Date**: [Date]
**Author**: [Your Name]

### Problem:
- Describe what was wrong with the original code

### Solution:
- Describe what was changed and why

### Impact:
- Performance impact
- Maintainability impact
- Breaking changes (if any)

### Files Changed:
- List of files modified

### Testing:
- Tests added/modified
- Manual testing performed
```

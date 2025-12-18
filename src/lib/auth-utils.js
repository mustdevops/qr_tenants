// Static authentication utilities (temporary until backend is ready)

const USERS = [
  {
    username: 'admin',
    password: 'admin123',
    role: 'agent',
    name: 'Agent Admin',
    email: 'agent@qrscanner.com',
  },
  {
    username: 'merchant',
    password: 'merchant123',
    role: 'merchant',
    name: 'Merchant User',
    email: 'merchant@qrscanner.com',
  },
];

export function authenticateUser(username, password) {
  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );
  
  if (user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  
  return null;
}

export function getCurrentUser() {
  if (typeof window === 'undefined') return null;
  
  const userStr = localStorage.getItem('currentUser');
  if (!userStr) return null;
  
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
}

export function setCurrentUser(user) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('currentUser', JSON.stringify(user));
}

export function logout() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('currentUser');
  localStorage.removeItem('subscriptionType');
}

export function getSubscriptionType() {
  if (typeof window === 'undefined') return 'temporary';
  return localStorage.getItem('subscriptionType') || 'temporary';
}

export function setSubscriptionType(type) {
  if (typeof window === 'undefined') return;
  if (type !== 'annual' && type !== 'temporary') {
    throw new Error('Invalid subscription type. Must be "annual" or "temporary"');
  }
  localStorage.setItem('subscriptionType', type);
}

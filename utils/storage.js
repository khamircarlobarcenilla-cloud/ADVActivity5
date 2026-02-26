import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'users_data';
const CURRENT_USER_KEY = 'current_user';

// Save user registration data
export const saveUser = async (userData) => {
  try {
    const existingUsers = await getUsers();
    const userExists = existingUsers.some(u => u.email === userData.email);
    
    if (userExists) {
      throw new Error('Email already registered');
    }

    const updatedUsers = [...existingUsers, userData];
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    return { success: true, message: 'User registered successfully' };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get all registered users
export const getUsers = async () => {
  try {
    const users = await AsyncStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  } catch (error) {
    console.error('Error getting users:', error);
    return [];
  }
};

// Login user (verify credentials)
export const loginUser = async (email, password) => {
  try {
    const users = await getUsers();
    console.log('Available users:', users);
    console.log('Trying to login with:', { email, password });
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      console.log('No user found with email:', email);
      return { success: false, error: 'Invalid email or password' };
    }

    console.log('Login successful for:', email);
    // Save current logged-in user
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    return { success: true, user };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: error.message };
  }
};

// Get current logged-in user
export const getCurrentUser = async () => {
  try {
    const user = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Update user profile by email
export const updateUserProfile = async (email, updates) => {
  try {
    if (!email) {
      throw new Error('Email is required');
    }

    const users = await getUsers();
    const userIndex = users.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const updatedUser = { ...users[userIndex], ...updates };
    users[userIndex] = updatedUser;
    
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

    return { success: true, user: updatedUser };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Clear all data
export const clearAllData = async () => {
  try {
    await AsyncStorage.removeItem(USERS_KEY);
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

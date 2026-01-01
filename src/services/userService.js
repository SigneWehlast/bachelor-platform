const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function getUsers() {
  try {
    const res = await fetch(`${BASE_URL}/api/user`);
    if (!res.ok) {
      throw new Error('Error while fetching users');
    }
    const data = await res.json();
    return data.map(user => ({
      id: user.user_id,
      firstName: user.first_name,
      lastName: user.last_name,
      initials: `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    }));
  } catch (err) {
    console.error('Error while fetching users', err);
    return [];
  }
}

export async function getUserRole(userId) {
  try {
    const res = await fetch(`${BASE_URL}/api/user/${userId}/role`);
    if (!res.ok) {
      throw new Error('Error while getting users role');
    }
    const role = await res.json();
    return {
      id: role.role_id,
      name: role.role_name
    };
  } catch (err) {
    console.error('Error while getting users role', err);
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found, log in');

    const res = await fetch(`${BASE_URL}/api/user/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error('Error while getting current user');

    const data = await res.json();
    return {
      id: data.user_id,
      firstName: data.first_name,
      lastName: data.last_name,
      initials: `${data.first_name[0]}${data.last_name[0]}`.toUpperCase(),
      role: data.role
    };
  } catch (err) {
    console.error('Error while getting current user', err);
    return null;
  }
}

export async function login(email, password) {
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Login failed');

    localStorage.setItem('token', data.token);
    return data.token;
  } catch (err) {
    console.error('Login failed:', err);
    return null;
  }
}
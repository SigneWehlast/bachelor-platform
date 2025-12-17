const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function getUsers() {
  try {
    const res = await fetch(`${BASE_URL}/api/user`);
    if (!res.ok) {
      throw new Error("Fejl ved hentning af brugere");
    }
    const data = await res.json();
    return data.map(user => ({
      id: user.user_id,
      firstName: user.first_name,
      lastName: user.last_name,
      initials: `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    }));
  } catch (err) {
    console.error("Fejl ved hentning af brugere:", err);
    return [];
  }
}

export async function getUserRole(userId) {
  try {
    const res = await fetch(`${BASE_URL}/api/user/${userId}/role`);
    if (!res.ok) {
      throw new Error("Fejl ved hentning af brugerrolle");
    }
    const role = await res.json();
    return {
      id: role.role_id,
      name: role.role_name
    };
  } catch (err) {
    console.error("Fejl ved hentning af brugerrolle:", err);
    return null;
  }
}
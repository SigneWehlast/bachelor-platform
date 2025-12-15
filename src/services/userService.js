const BASE_URL = import.meta.env.VITE_BASE_URL;

export async function getUsers() {
  try {
    const res = await fetch(`${BASE_URL}/api/user`);
    if (!res.ok) {
      throw new Error("Fejl ved hentning af brugere");
    }
    const data = await res.json();
    return data.map(user => ({
      firstName: user.first_name,
      lastName: user.last_name,
      initials: `${user.first_name[0]}${user.last_name[0]}`.toUpperCase()
    }));
  } catch (err) {
    console.error("Fejl ved hentning af brugere:", err);
    return [];
  }
}

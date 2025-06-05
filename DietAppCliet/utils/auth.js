import { jwtDecode } from 'jwt-decode'; 


export const getRoleFromToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    return role;
  } catch (e) {
    console.error("Rol ayrıştırılamadı:", e);
    return null;
  }
};

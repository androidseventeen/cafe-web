// Every role lands on the storefront for now — no /admin route exists yet.
// Flip this to role-specific paths (e.g. '/admin') once that area is built.
export function getPostLoginRedirect(role) {
  switch (role) {
    case 'owner':
    case 'admin':
    case 'shopper':
    default:
      return '/';
  }
}

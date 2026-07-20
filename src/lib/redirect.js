// Admins and owners land on the dashboard; shoppers land on the storefront.
export function getPostLoginRedirect(role) {
  switch (role) {
    case 'owner':
    case 'admin':
      return '/admin';
    case 'shopper':
    default:
      return '/';
  }
}

import type { FlatWithCategoryRequest, HomeRequest } from "../services";

export const publishChecker = (_data: HomeRequest | FlatWithCategoryRequest) => {
  // if (useAuthStore.getState().isAuthenticated) {
  //   return true;
  // }
  //
  // if ('flat' in _data) {
  //   return _data.flat.published ?? false;
  // } else {
  //   return _data.published ?? false;
  // }

  return true;
};

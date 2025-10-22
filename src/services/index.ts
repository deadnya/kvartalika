export {apiClient} from './api.config.ts';

export type * from './api.types.ts';

export type { ApartmentDtoResponse, ApartmentDto } from './api/pages.api.types';

export * from './auth.service.ts';

export * from './admin.service.ts';

export * from './content.service.ts';

export * from './public.service.ts';

export const TABS = ['managers', 'admins', 'files'];
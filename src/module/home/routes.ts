import { IRouterOption } from 'src/router/interface'
import { EHomeRoutes } from './routes.enum'
import { Home } from '.'

export const HomeRoutes: IRouterOption[] = [
  {
    path: '/',
    component: Home,
    name: EHomeRoutes.HOME,
    exact: true,
    meta: {
      requireAuth: false
    }
  }
]

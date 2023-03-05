import axios, { AxiosResponse } from 'axios'

export class ProfileApi {
  static _prefix = '/profile'

  /**
   * Get authenticated profile
   */
  static detail(): Promise<AxiosResponse<{id?: string}>> {
    return axios.get(this._prefix)
  }
}

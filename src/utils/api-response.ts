/**
 * ApiResponse class to handle response data, used to ensure a consistent response format
 *
 * @template T - Type of data to be returned in response
 */
class ApiResponse<T> {
  /**
   * ApiResponse constructor
   *
   * @param status - Status code of the response
   * @param message - Message to be sent in response
   * @param data - Data to be sent in response
   */
  constructor(
		public status: number,
		public message: string,
		public data: Partial<T> | Array<Partial<T>> = {}) {
    this.status = status
    this.message = message
    this.data = data
  }
}

export default ApiResponse

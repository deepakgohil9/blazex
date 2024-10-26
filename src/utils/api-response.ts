class ApiResponse<T> {
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

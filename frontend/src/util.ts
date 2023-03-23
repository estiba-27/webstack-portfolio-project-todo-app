import { AxiosInstance } from 'axios'

export const generateHeader = (username?: string, token?: string): string => {
	const json = {
		"some-other-junk-info": Math.random(),
		"some-other-junk-info-2": Math.random(),
		"some-other-junk-info-3": Math.random(),
		"some-other-junk-info-4": Math.random(),
		username, token
	}

	return btoa(JSON.stringify(json))
}

export const resumeSession = async (axios: AxiosInstance) => {
	const token = atob(localStorage.getItem('todo-token') as string)
	const username = atob(localStorage.getItem('todo-username') as string)

	let result = await axios.post('/api/resume-session', {}, {
		headers: {
			Authorization: `Bearer ${generateHeader(username, token)}`
		}
	})

	return result.data.success
}
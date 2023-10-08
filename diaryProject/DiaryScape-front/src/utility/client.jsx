import axios from "axios";

axios.defaults.withCredentials = true;//axios가 웹 브라우져 내에서 항상 캐시를 소유할 수 있게 변경

const axiosConfig = {
    baseURL: import.meta.env.VITE_API_URL,
}

const client = axios.create(axiosConfig)

export default client
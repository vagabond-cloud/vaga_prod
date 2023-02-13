import { v4 as uuidv4 } from 'uuid'

export const errorHandler = (err) => {
    const error = {
        message: err.message,
        type: err.name,
        code: err.code || 500,
        vagatrace_id: uuidv4(),
    }
    return error
}

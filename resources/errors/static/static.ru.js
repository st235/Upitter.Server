module.exports = {
	UNKNOWN_ERROR: {
		internalDescription: 'Неизвестная ошибка',
		externalDescription: 'Неизвестная ошибка'
	},

	INTERNAL_SERVER_ERROR: {
		internalDescription: 'Внутрення ошибка сервера',
		externalDescription: 'Внутрення ошибка сервера'
	},

	PROPERTY_HAS_INCORRECT_TYPE: {
		internalDescription: 'Неправильный тип данных',
		externalDescription: 'Некорректный запрос'
	},

	PROPERTY_NOT_SUPPLIED: {
		internalDescription: 'Свойство не передано',
		externalDescription: 'Некорректный запрос'
	},

	PROPERTY_OUT_OF_RANGE: {
		internalDescription: 'Свойство не попадает в диапазон',
		externalDescription: 'Некорректный запрос'
	},

	IS_NOT_EQUAL: {
		internalDescription: 'Свойство не эквивалентно',
		externalDescription: 'Некорректный запрос'
	},

	UNAUTHORIZED: {
		internalDescription: 'Запрос без авторизации',
		externalDescription: 'Доступ запрещен'
	},

	INCORRECT_CREDENTIALS: {
		internalDescription: 'Переданный логин или пароль некорректны',
		externalDescription: 'Неверный логин или пароль'
	},

	INCORRECT_SMS_CODE: {
		internalDescription: 'Неправильный SMS-код',
		externalDescription: 'SMS-код введен неправильно'
	},

	INVALID_TOKEN_FOR_TIMELINER: {
		internalDescription: 'Неправильный токен для таймлайнера',
		externalDescription: 'Внутренняя ошибка сервера'
	},

	BAD_REQUEST_FOR_TIMELINER: {
		internalDescription: 'Неправильный запрос к таймлайнеру. Какие-то свойства не были переданы',
		externalDescription: 'Внутренняя ошибка сервера'
	},

	TIMELINER_INNER_ERROR: {
		internalDescription: 'Внутренняя ошибка таймлайнера',
		externalDescription: 'Внутренняя ошибка сервера'
	},

	INVALID_TIMELINER_SECRET: {
		internalDescription: 'Секретный ключ переданный таймлайнеру некорректен',
		externalDescription: 'Внутренняя ошибка сервера'
	}
};
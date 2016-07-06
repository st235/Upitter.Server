module.exports = {
	UNKNOWN_ERROR: {
		internalDescription: 'Неизвестная ошибка',
		externalDescription: 'Неизвестная ошибка'
	},

	INTERNAL_SERVER_ERROR: {
		internalDescription: 'Внутрення ошибка сервера',
		externalDescription: 'Внутрення ошибка сервера'
	},

	INTERNAL_REDIS_ERROR: {
		internalDescription: 'Что-то пошло не так с редисом',
		externalDescription: 'Внутренняя ошибка сервера'
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

	PHONE_NOT_FOUND: {
		internalDescription: 'Номер телефона не найден',
		externalDescription: 'Пользователь с таким номером телефона не найден'
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

	NUMBER_OF_ATTEMPTS_EXCEEDED: {
		internalDescription: 'Число попыток ввода кода превышено',
		externalDescription: 'Закончились попытки ввода кода. Перезапросите код еще раз'
	},

	USER_ALREADY_EXISTS: {
		internalDescription: 'Пользователь с таким телефоном уже сущесвует',
		externalDescription: 'Пользователь уже существует'
	},

	USER_ALREADY_VOTED: {
		internalDescription: 'Пользователь уже проголосовал',
		externalDescription: 'Пользователь уже проголосовал'
	},

	NO_TEMPORARY_TOKEN_IN_DB: {
		internalDescription: 'Временный токен отсутствует в базе данных',
		externalDescription: 'Доступ запрещен'
	},

	INVALID_TEMPORARY_TOKEN: {
		internalDescription: 'Временный токен не соответствует токену в базе',
		externalDescription: 'Доступ запрещен'
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
	},

	REQUEST_SERVICE_ERROR: {
		internalDescription: 'requestService вернул ошибку',
		externalDescription: 'Внутренняя ошибка сервера'
	},

	SMS_SERVICE_ERROR: {
		internalDescription: 'Ошибка в СМС-сервисе',
		externalDescription: 'Внутренняя ошибка сервера'
	},

	SUBSCRIBE_ERROR_1: {
		internalDescription: 'Пользователь уже подписан на эту компанию',
		externalDescription: 'Вы уже подписаны на эту компанию'
	},

	SUBSCRIBE_ERROR_2: {
		internalDescription: 'Пользователь еще не подписан на эту компанию',
		externalDescription: 'Вы еще не подписаны на эту компанию'
	},

	ACCESS_DENIED: {
		internalDescription: 'Доступ запрещен',
		externalDescription: 'Доступ запрещен'
	}
};

/** 
* Массив маршрутов, доступных для общего пользования
* Эти маршруты не требуют аутентификации
* @type {string[]}
*/

export const publicRoutes = [
	'/'
];

/**
* Массив маршрутов, которые используются для аутентификации
* Эти маршруты будут перенаправлять зарегистрированных пользователей в /settings
* @type {string[]}
*/

export const authRoutes = [
	'/auth/login',
	'/auth/register',
	'/auth/error',
];

/**
* Префикс для маршрутов аутентификации API
* Маршруты, начинающиеся с этого префикса, используются для целей аутентификации API
* @type {string}
*/

export const apiAuthPrefix = '/api/auth';

/**
* Путь перенаправления по умолчанию после входа в систему
* @type {string}
*/

export const DEFAULT_LOGIN_REDIRECT = '/settings';
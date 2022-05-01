/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', 'HomeController.index').as('index').middleware('auth')

Route.get('/register', 'AuthController.registerShow').as('auth.register.show').middleware('guest')
Route.get('/login', 'AuthController.loginShow').as('auth.login.show').middleware('guest')
Route.get('/forgot-password', 'ForgotPasswordsController.index').as('forgot.index').middleware('guest')
Route.get('/forgot-password/:token', 'ForgotPasswordsController.edit').as('forgot.edit').middleware('guest')
Route.get('/logout', 'AuthController.logout').as('auth.logout').middleware('auth')
Route.get('/verify-email/:email', 'EmailsController.confirmEmail').as('verifyEmail')
Route.get('/profile/:username', 'ProfilesController.index').as('profile.index').middleware('auth')
Route.get('/account/edit', 'ProfilesController.edit').as('profile.edit').middleware('auth')
Route.get('/posts/create', 'PostsController.create').as('posts.create').middleware('auth')
Route.get('/likes', 'LikesController.index').as('like.index').middleware('auth')
Route.get('/search', 'SearchesController.index').as('search.index').middleware('auth')
Route.get('/save/categories', 'CategoriesController.index').as('category.index').middleware('auth')
Route.get('/save/:category', 'SavesController.index').as('save.index').middleware('auth')

Route.post('/login', 'AuthController.login').as('auth.login').middleware('guest')
Route.post('/register', 'AuthController.register').as('auth.register').middleware('guest')
Route.post('/forgot-password', 'ForgotPasswordsController.store').as('forgotPassword').middleware('guest')
Route.post('/verify-email', 'EmailsController.sendVerify').as('email.verify')
Route.post('/posts/store', 'PostsController.store').as('posts.store').middleware('auth')
Route.post('/follow/:id', 'FollowsController.store').as('follow.store').middleware('auth')
Route.post('/like/:postId', 'LikesController.store').as('like.store').middleware('auth')
Route.post('/category/create', 'CategoriesController.create').as('category.create').middleware('auth')
Route.post('/category/:postId', 'CategoriesController.store').as('category.store').middleware('auth')
Route.post('/save/:postId', 'SavesController.store').as('save.store').middleware('auth')

Route.patch('/account/edit', 'ProfilesController.update').as('profile.update').middleware('auth')
Route.patch('/forgot-password/reset-password', 'ForgotPasswordsController.update').as('forgot.reset').middleware('guest')
Route.patch('/post/:id', 'PostsController.update').as('post.update').middleware('auth')
Route.patch('/category/:id', 'CategoriesController.update').as('category.update').middleware('auth')

Route.delete('/unfollow/:id', 'FollowsController.destroy').as('follow.destroy').middleware('auth')
Route.delete('/like/:postId', 'LikesController.destroy').as('like.destroy').middleware('auth')
Route.delete('/post/:id', 'PostsController.destroy').as('post.destroy').middleware('auth')
Route.delete('/save/:postId', 'SavesController.destroy').as('save.destroy').middleware('auth')
Route.delete('/category/:id', 'CategoriesController.destroy').as('category.destroy').middleware('auth')

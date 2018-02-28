import { expect } from 'chai';
import { TestBed } from './TestBed';

import { UserModel, User, accessRoles } from '../models/user';
import { status, ROUTE_STATUS, AUTH_STATUS } from '../libs/responseMessage';
import { TokenResponse } from '../controllers/auth';

// ---------------------------------
// ---- Authorization TestSuite ----
// ---------------------------------

describe('REST: Authorization', () => {

	before(() => {
		TestBed.stubFindOne(UserModel);
		TestBed.stubSave(UserModel);
	});

	after(() => {
		// ff
	});


	// ---------------------------------
	// -------- /api/auth/token --------
	// ---------------------------------


	describe('/api/auth/token', () => {
		it('GET /api/auth/token 200', async () => {
			const res = await TestBed.http.get('/api/auth/token').set('Authorization', TestBed.token);

			expect(res).to.have.status(200);
			expect(res).to.have.property('body');

			const body: TokenResponse = res.body;
			expect(body.token).to.contains(TestBed.token.split('.')[0]);
			expect(body.user).to.have.property('username');
			expect(body.user).property('username').to.equal(TestBed.fakeUser.username);
		});

		it('GET /api/auth/token 401', async () => {
			try {
				const res = await TestBed.http.get('/api/auth/token');
			} catch (error) {
				expect(error).to.have.status(401);
			}
		});
	});



	// ---------------------------------
	// -------- /api/auth/login --------
	// ---------------------------------

	describe('/api/auth/login', () => {
		it('POST /api/auth/login 200', async () => {
			const user: Partial<User> = { username: TestBed.fakeUser.username, password: TestBed.fakeUser.password };
			const res = await TestBed.http.post('/api/auth/login').send(user);

			expect(res).to.have.status(200);
			expect(res).to.have.property('body');

			const body: TokenResponse = res.body;
			expect(body).to.have.property('token');
			expect(body).property('token').to.contain('bearer ');
			expect(body.user).to.have.property('username');
			expect(body.user).property('username').to.equal(TestBed.fakeUser.username);
		});


		it('POST /api/auth/login 401', async () => {
			const user: Partial<User> = { username: TestBed.fakeUser.username, password: TestBed.fakeUser.password + 'bad' };

			try {
				const res = await TestBed.http.post('/api/auth/login').send(user);
			} catch (error) {
				expect(error).to.have.status(401);
			}
		});
	});


	// ---------------------------------
	// ------ /api/auth/register -------
	// ---------------------------------

	describe('/api/auth/register', () => {
		it('POST /api/auth/register 200', async () => {
			const user: Partial<User> = {
				username: TestBed.fakeUser.username + '2',
				password: TestBed.fakeUser.password + '2',
				role: accessRoles.user
			};

			const res = await TestBed.http.post('/api/auth/register').send(user);

			expect(res).status(200);
			expect(res).to.have.property('body');
			expect(res.body).to.have.property('message');
			expect(res.body).property('message').to.equal(AUTH_STATUS.ACCOUNT_CREATED);
		});


		it('POST /api/auth/register 400', async () => {
			const noUsername: Partial<User> = { password: TestBed.fakeUser.password + '2', role: accessRoles.user };
			const noPassword: Partial<User> = { username: TestBed.fakeUser.username + '2', role: accessRoles.user };
			const noRole: Partial<User> = { username: TestBed.fakeUser.username + '2', password: TestBed.fakeUser.password + '2' };
			const badRole: Partial<User> = {
				username: TestBed.fakeUser.username + '2',
				password: TestBed.fakeUser.password + '2', role: <any>'bad'
			};

			const [noUsernameRes, noPasswordRes, noRoleRes, badRoleRes] = await Promise.all([
				TestBed.http.post('/api/auth/register').send(noUsername),
				TestBed.http.post('/api/auth/register').send(noPassword),
				TestBed.http.post('/api/auth/register').send(noRole),
				TestBed.http.post('/api/auth/register').send(badRole)
			]);

			// noUsernameRes
			expect(noUsernameRes).to.have.status(400);
			expect(noUsernameRes).to.have.property('body');
			expect(noUsernameRes.body).to.have.property('message');
			expect(noUsernameRes.body).property('message').to.equal(AUTH_STATUS.NO_USERNAME_OR_PASSWORD);

			// noPasswordRes
			expect(noPasswordRes).to.have.status(400);
			expect(noPasswordRes).to.have.property('body');
			expect(noPasswordRes.body).to.have.property('message');
			expect(noPasswordRes.body).property('message').to.equal(AUTH_STATUS.NO_USERNAME_OR_PASSWORD);

			// noUsernameRes
			expect(noRoleRes).to.have.status(400);
			expect(noRoleRes).to.have.property('body');
			expect(noRoleRes.body).to.have.property('message');
			expect(noRoleRes.body).property('message').to.equal(AUTH_STATUS.NO_OR_BAD_ROLE);

			// noUsernameRes
			expect(badRoleRes).to.have.status(400);
			expect(badRoleRes).to.have.property('body');
			expect(badRoleRes.body).to.have.property('message');
			expect(badRoleRes.body).property('message').to.equal(AUTH_STATUS.NO_OR_BAD_ROLE);
		});


		it('POST /api/auth/register 409', async () => {
			const user: Partial<User> = {
				username: TestBed.fakeUser.username,
				password: TestBed.fakeUser.password,
				role: accessRoles.admin
			};

			const res = await TestBed.http.post('/api/auth/register').send(user);

			expect(res).status(409);
			expect(res).to.have.property('body');
			expect(res.body).to.have.property('message');
			expect(res.body).property('message').to.equal(AUTH_STATUS.USERNAME_NOT_AVILIABLE);
		});
	});


	// ---------------------------------
	// --- /api/auth/updatepassword ----
	// ---------------------------------

	describe('/api/auth/updatepassword', () => {

		it('POST /api/auth/updatepassword 200', async () => {
			const user = {
				currentPassword: TestBed.fakeUser.password,
				password: TestBed.fakeUser.password + '2',
				confirm: TestBed.fakeUser.password + '2',
			};

			const res = await TestBed.http.post('/api/auth/updatepassword').send(user).set('Authorization', TestBed.token);

			expect(res).status(200);
			expect(res).to.have.property('body');
			expect(res.body).to.have.property('message');
			expect(res.body).property('message').to.equal(AUTH_STATUS.PASSWORD_UPDATED);
		});

		it('POST /api/auth/updatepassword 400', async () => {


			const noCurrentPassword = { password: TestBed.fakeUser.password + '2', confirm: TestBed.fakeUser.password + '2' };
			const noPassword = { currentPassword: TestBed.fakeUser.password, confirm: TestBed.fakeUser.password + '2' };
			const noConfirm = { currentPassword: TestBed.fakeUser.password, password: TestBed.fakeUser.password + '2' };
			const confirmMismatch = {
				currentPassword: TestBed.fakeUser.password,
				password: TestBed.fakeUser.password + '2', confirm: TestBed.fakeUser.password + '3'
			};


			const [noCurrentPasswordRes, noPasswordRes, noConfirmRes, confirmMismatchRes] = await Promise.all([
				TestBed.http.post('/api/auth/updatepassword').send(noCurrentPassword).set('Authorization', TestBed.token),
				TestBed.http.post('/api/auth/updatepassword').send(noPassword).set('Authorization', TestBed.token),
				TestBed.http.post('/api/auth/updatepassword').send(noConfirm).set('Authorization', TestBed.token),
				TestBed.http.post('/api/auth/updatepassword').send(confirmMismatch).set('Authorization', TestBed.token)
			]);

			// noCurrentPasswordRes
			expect(noCurrentPasswordRes).to.have.status(400);
			expect(noCurrentPasswordRes).to.have.property('body');
			expect(noCurrentPasswordRes.body).to.have.property('message');
			expect(noCurrentPasswordRes.body).property('message').to.equal(AUTH_STATUS.NO_PASSWORD_OR_NEW_PASSWORDS);

			// noPasswordRes
			expect(noPasswordRes).to.have.status(400);
			expect(noPasswordRes).to.have.property('body');
			expect(noPasswordRes.body).to.have.property('message');
			expect(noPasswordRes.body).property('message').to.equal(AUTH_STATUS.NO_PASSWORD_OR_NEW_PASSWORDS);

			// noConfirmRes
			expect(noConfirmRes).to.have.status(400);
			expect(noConfirmRes).to.have.property('body');
			expect(noConfirmRes.body).to.have.property('message');
			expect(noConfirmRes.body).property('message').to.equal(AUTH_STATUS.NO_PASSWORD_OR_NEW_PASSWORDS);

			// confirmMismatchRes
			expect(confirmMismatchRes).to.have.status(400);
			expect(confirmMismatchRes).to.have.property('body');
			expect(confirmMismatchRes.body).to.have.property('message');
			expect(confirmMismatchRes.body).property('message').to.equal(AUTH_STATUS.PASSWORD_AND_CONFIRM_NOT_EQUAL);
		});


		it('POST /api/auth/updatepassword 401', async () => {
			const noTokenAttempt = {
				currentPassword: TestBed.fakeUser.password,
				password: TestBed.fakeUser.password + '2',
				confirm: TestBed.fakeUser.password + '2',
			};
			const wrongCurrentPasswordAttempt = {
				currentPassword: TestBed.fakeUser.password + '1',
				password: TestBed.fakeUser.password + '2',
				confirm: TestBed.fakeUser.password + '2'
			};

			const [noTokenAttemptRes, wrongCurrentPasswordAttemptRes] = await Promise.all([
				TestBed.http.post('/api/auth/updatepassword').send(noTokenAttempt),
				TestBed.http.post('/api/auth/updatepassword').send(wrongCurrentPasswordAttempt).set('Authorization', TestBed.token),
			]);

			// noTokenAttemptRes
			expect(noTokenAttemptRes).status(401);
			// expect(noTokenAttemptRes).to.have.property('body');
			// expect(noTokenAttemptRes.body).to.have.property('message');
			// expect(noTokenAttemptRes.body).property('message').to.equal(ROUTE_STATUS.UNAUTHORISED);

			// wrongCurrentPasswordAttemptRes
			expect(wrongCurrentPasswordAttemptRes).status(401);
			expect(wrongCurrentPasswordAttemptRes).to.have.property('body');
			expect(wrongCurrentPasswordAttemptRes.body).to.have.property('message');
			expect(wrongCurrentPasswordAttemptRes.body).property('message').to.equal(AUTH_STATUS.PASSWORD_DID_NOT_MATCH);
		});

	});

});

import { expect } from 'chai';
import { TestBed } from './TestBed';

import { Content, content } from '../models/content';
import { status, ROUTE_STATUS, AUTH_STATUS } from '../libs/responseMessage';


// ---------------------------------
// ------- Content TestSuite -------
// ---------------------------------

describe('REST: Content', () => {

	before(() => {
		TestBed.stubFindOne(Content);
		TestBed.stubFind(Content);
		TestBed.stubSave(Content);
	});

	after(() => {
		// (<any>TestBed.http).close();
	});



	// ---------------------------------
	// ----------- /api/cms/ -----------
	// ---------------------------------


	describe('/api/cms/', () => {
		it('GET /api/cms/ 200', async () => {
			const res = await TestBed.http.get('/api/cms/').set('Authorization', TestBed.token);

			expect(res).to.have.status(200);
			expect(res).to.have.property('body');
			expect(res.body).to.be.an('array');
		});

		it('GET /api/cms/ 200, member', async () => {
			const res = await TestBed.http.get('/api/cms/').set('Authorization', TestBed.token);

			// TODO: Implement member filtering

			expect(true).to.equal(false);
		});

		it('GET /api/cms/ 200, admin', async () => {
			const res = await TestBed.http.get('/api/cms/').set('Authorization', TestBed.token);

			// TODO: Implement admin filtering

			expect(true).to.equal(false);
		});


		it('POST /api/cms/ 200', async () => {

			const content = {
				_id: '1234567890',
				title: 'test',
				route: 'test',
				content: 'test',
				access: 'everyone',
				folder: 'test'
			};

			const res = await TestBed.http.post('/api/cms/')
				.set('Authorization', TestBed.token)
				.send(content);

			// const res = await TestBed.http.post('/api/cms/')
			//   .set('Authorization', TestBed.token)
			//   .send(content);

			expect(res).to.have.status(200);
			expect(res).to.have.property('body');
			expect(res.body).to.be.an('object');
			expect(res.body).have.property('content');
			expect(res.body).property('content').to.equal(content.content);

			const res2 = await TestBed.http.get('/api/cms/').set('Authorization', TestBed.token);
			expect(res2).to.have.status(200);
			expect(res2).to.have.property('body');
			expect(res2.body).to.be.an('array');
			expect(res2.body[0]).to.have.property('route');
			expect(res2.body[0]).property('route').to.equal(content.route);
		});

		it('POST /api/cms/ 200, sanitation', async () => {

			const content = {
				_id: '1234567890',
				title: 'test',
				route: 'test/test//test\\test',
				content: `
          <h2>Hello World</h2>
          <p>
            <img src="javascript:alert('Vulnerable');" />
            <a href="javascript:alert('Vulnerable');">evil</a>
          </p>
          <script>alert('Vulnerable');</script>
          <script src="/evil.js"></script>
          <a href="/acceptable">good</a>
          <img src="/acceptable.jpg" />`,
				access: 'everyone',
				folder: 'test'
			};

			const res = await TestBed.http.post('/api/cms/')
				.set('Authorization', TestBed.token)
				.send(content);

			expect(res).to.have.status(200);
			expect(res).to.have.property('body');
			expect(res.body).to.be.an('object');

			expect(res.body).have.property('content');
			expect(res.body).property('content').to.not.contain('javascript');
			expect(res.body).property('content').to.not.contain('alert');
			expect(res.body).property('content').to.not.contain('Vulnerable');
			expect(res.body).property('content').to.not.contain('<script>');
			expect(res.body).property('content').to.not.contain('evil.js');

			expect(res.body).property('content').to.contain('<a href="/acceptable">good</a>');
			expect(res.body).property('content').to.contain('<img src="/acceptable.jpg" />');

			expect(res.body).have.property('route');
			expect(res.body).property('route').to.not.contain('/');
			expect(res.body).property('route').to.not.contain('\\');
		});

		it('POST /api/cms/ 401', async () => {
			// unauthorized when no token is provided
			const res = await TestBed.http.post('/api/cms/').send({});
			// .set('Authorization', TestBed.token)
			expect(res).to.have.status(401);
		});

		it('POST /api/cms/ 422', async () => {

			const properContent = {
				_id: '1234567890',
				title: 'test',
				route: 'test',
				content: 'test',
				access: 'everyone',
				folder: 'test'
			};

			const badRoute = properContent;
			delete badRoute.route;

			const badTitle = properContent;
			delete badTitle.title;

			const badContent = properContent;
			delete badContent.content;

			const res = await TestBed.http.get('/api/cms/')
				.set('Authorization', TestBed.token);

			// TODO: Implement this test
			expect(true).to.equal(false);
		});
	});

	// ---------------------------------
	// -------- /api/cms/:route --------
	// ---------------------------------

	describe('/api/cms/:route <- route = test', () => {
		it('GET /api/cms/:route 200', async () => {

			const testRoute = 'test';

			const res = await TestBed.http.get('/api/cms/' + testRoute).set('Authorization', TestBed.token);

			expect(res).to.have.status(200);
			expect(res).to.have.property('body');
			expect(res.body).to.have.property('route');
			expect(res.body).property('route').to.equal(testRoute);
			expect(res.body).to.have.property('content');
			expect(res.body).property('content').to.equal('test');
		});
	});

});

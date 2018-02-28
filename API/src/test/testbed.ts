import { request, use as chaiUse } from 'chai';
import ChaiHttp = require('chai-http');
import { stub, SinonStub } from 'sinon';
import * as express from 'express';
import { get as configGet } from 'config';

import { Setup } from '../libs/setup';
import { AppRouter } from '../router';

import { Model, Document } from 'mongoose';
import { UserModel, User } from '../models/user';
import { sign } from 'jsonwebtoken';


interface Database {
	[key: string]: any[];
}


class TestBedSingleton {
	private _http: ChaiHttp.Agent;
	private _fakeUser: User;
	private _token: string;
	private _stubs: SinonStub[] = [];

	private _database: Database = {};

	constructor() {
		// Setup test environment
		chaiUse(ChaiHttp);
		const app = express();
		Setup.initiate(app);
		AppRouter.initiate(app);
		this._http = (<any>request(app)).keepOpen(); // TODO: Update @types/chai-http

		// Create initial user
		this._fakeUser = new UserModel({
			_id: '1234567890',
			username: 'Test',
			username_lower: 'test',
			password: 'test',
			role: 'admin'
		});
		this._token = 'bearer ' + sign(
			{ _id: this._fakeUser._id, usermodelName: this._fakeUser.username, role: this._fakeUser.role },
			configGet<string>('secret'), { expiresIn: 10800 }
		);
		this._database.User = [this._fakeUser];

		try {
			this.stubUserComparePassword();
			this.stubFindById(UserModel);
		} catch (e) {
			// soft
		}
	}

	get http(): ChaiHttp.Agent {
		return this._http;
	}

	get fakeUser(): User {
		return this._fakeUser;
	}

	get token(): string {
		return this._token;
	}




	/**
	 * Stubs the User.comparePassword Mongoose method
	 * @return {SinonStub}             the stub
	 */
	private stubUserComparePassword(): SinonStub {
		const s = stub(UserModel.prototype, 'comparePassword').callsFake(
			(candidatePassword: string, cb: (err: Error, isMatch?: boolean) => void) => {
				cb(null, candidatePassword === this._fakeUser.password);
				return null;
			}
		);
		this._stubs.push(s);
		return s;
	}

	/**
	 * Stubs the .findById Mongoose method
	 * @param  {Model<Document>} model the model to stub
	 * @return {SinonStub}             the stub
	 */
	public stubFindById(model: Model<Document>): SinonStub {
		if (!this._database[model.modelName]) {
			this._database[model.modelName] = [];
		}
		const s = stub(model, 'findById').callsFake((id: string, callback: any) => {
			callback(null, this._database[model.modelName].find((doc) => (id === doc._id)));
		});
		this._stubs.push(s);
		return s;
	}

	/**
	 * Stubs the .findOne Mongoose method
	 * @param {Model<Document>} model the model to stub
	 * @return {SinonStub}            the stub
	 */
	public stubFindOne(model: Model<Document>): SinonStub {
		if (!this._database[model.modelName]) {
			this._database[model.modelName] = [];
		}
		const s = stub(model, 'findOne').callsFake((conditions: any, returnProperties: any, callback?: any) => {
			if (!callback) { callback = returnProperties; }
			callback(null, this._database[model.modelName].find((doc: any) => {
				return Object.keys(conditions).every((key) => (doc[key] && conditions[key] === doc[key]));
			}));
		});
		this._stubs.push(s);
		return s;
	}

	/**
	 * Stubs the .find Mongoose method
	 * @param {Model<Document>} model the model to stub
	 * @return {SinonStub}            the stub
	 */
	public stubFind(model: Model<Document>): SinonStub {
		if (!this._database[model.modelName]) {
			this._database[model.modelName] = [];
		}
		const s = stub(model, 'find').callsFake((conditions: any, returnProperties: any, callback?: any) => {
			if (!callback) { callback = returnProperties; }
			// here we filter instead of finding. Important difference.
			callback(null, this._database[model.modelName].filter((doc: any) => {
				// find first object that matches..
				return Object.keys(conditions).every((key) => {
					// if the condition to match includes mongoose $in, use that to match against
					if (typeof conditions[key] === 'object') {
						if (conditions[key].hasOwnProperty('$in')) {
							return doc[key] && conditions[key].$in.includes(doc[key]);
						}
					} else {
						// else match key and key value pairs
						return (doc[key] && conditions[key] === doc[key]);
					}
				});
			}));
		});
		this._stubs.push(s);
		return s;
	}

	/**
	 * Stubs the .findOneAndUpdate Mongoose method
	 * @param {Model<Document>} model the model to stub
	 * @return {SinonStub}            the stub
	 */
	public stubFindOneAndUpdate(model: Model<Document>): SinonStub {
		if (!this._database[model.modelName]) {
			this._database[model.modelName] = [];
		}
		const s = stub(model, 'findOneAndUpdate').callsFake(
			(conditions: any, update: any, settings: any = {}, callback: any) => {
				// find a match
				const match = this._database[model.modelName].find((doc: any) => {
					return Object.keys(conditions).every((key) => (doc[key] && conditions[key] === doc[key]));
				});
				const updatedDocument = match;
				// Update the match if it was found
				if (match) {
					Object.entries(update.$set).forEach((key: any, value: any) => {
						updatedDocument[key] = value;
					});
					const index = this._database[model.modelName].indexOf(match);
					this._database[model.modelName][index] = updatedDocument;
				}
				// return err, document (updatedDocument if new is set in settings)
				callback(!!match, settings && settings.new ? updatedDocument : match);
			}
		);
		// Store the stub
		this._stubs.push(s);
		return s;
	}


	/**
	 * Stubs the .save Mongoose method
	 * @param {Model<Document>} model the model to stub
	 * @return {SinonStub}            the stub
	 */
	public stubSave(model: Model<Document>): SinonStub {
		if (!this._database[model.modelName]) {
			this._database[model.modelName] = [];
		}
		const self = this;
		const s = stub(model.prototype, 'save').callsFake(function (callback: any) {
			// scoping 'this' with the function! Important!
			self._database[model.modelName].push(this);
			return callback(null, this);
		});
		// Store the stub
		this._stubs.push(s);
		return s;
	}


	/**
	 * Restores all stubbed methods
	 */
	public stubsRestore(): void {
		for (const s of this._stubs) {
			s.restore();
		}
		this._stubs = [];
	}

}

export const TestBed = new TestBedSingleton();
